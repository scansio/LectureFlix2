/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseController from './base/BaseController'
import UserModel from '../models/UserModel'
import UserProfileModel from '../models/UserProfileModel'
import Authenticate from '../miscs/Authenticate'
import { getDefinedValuesFrom, getUser } from '../common'
import { rand } from '../libs/md5'
import { NextFunction, Request, Response } from 'express'
import { ACTIVE, HOTLISTED, MIN } from '../configs/constants'
import Mailer from '../miscs/Mailer'
import UserEmailAuthenticationModel from '../models/UserEmailAuthenticationModel'
import IUser from '../types/IUser'
import {
  BAD_AUTHENTICATION,
  BAD_AUTHORIZATION,
  BAD_REQUEST,
  GET_SUCCESS,
  NOTFOUND,
  POST_SUCCESS,
  SERVICE_UNAVAILABLE,
} from '../configs/statusCodeConstants'
import {
  ALREADY_VERIFIED,
  EXPIRED_CONFIRMATION_CODE,
  INVALID_CONFIRMATION_CODE,
  INVALID_REFID,
  SENDMAIL_ERROR,
  UNVERIFIED,
  USER_NOTFOUND,
  USER_SUSPENDED,
} from '../configs/errorCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import FileStore from '../miscs/FileStore'
import { randomInt } from 'crypto'
import CountrieModel from '../models/CountrieModel'
import StateModel from '../models/StateModel'
import UserSettingModel from '../models/UserSettingModel'
import SharedConfig from '../libs/SharedConfig'
import passport, { Profile } from 'passport'
import { Strategy } from 'passport-google-oauth2'
import IUserProfile from '../types/IUserProfile'

class User extends BaseController {
  private oauth2: Profile | null = null

  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async logged() {
    this.status(true).message('Logged').send()
  }

  async login({ email, password }: any) {
    let isAdmin
    if (await new Authenticate(this.req).verify()) {
      this.user = getUser(this.req) as IUser
      isAdmin = await this.adminAccess(false)
    }
    let user
    if (isAdmin) {
      user = await UserModel.findOne({
        email,
      }).exec()
    } else if (this.oauth2) {
      user = await UserModel.findOne({
        email,
        oauth2: true,
      }).exec()
    } else {
      user = await UserModel.findOne({
        email,
        password,
      }).exec()
    }
    if (user == null) {
      if (isAdmin) {
        this.statusCode(NOTFOUND).errorCode(USER_NOTFOUND).error(`A user with email: ${email} does not exist`).send()
      } else {
        this.statusCode(BAD_REQUEST)
          .error(this.oauth2 ? 'Could not verify your account try again shortly' : 'Invalid credentials.')
          .send()
      }
    } else {
      if (isAdmin || user.status == ACTIVE) {
        const authenticate = new Authenticate(this.req)
        const token = authenticate.generateToken({
          ...(user as any)._doc,
          uid: user._id,
        })
        this.status(true).message('Logged in').setData(token).uid(user._id).send()
      } else if (user.status == HOTLISTED) {
        this.statusCode(BAD_AUTHORIZATION)
          .errorCode(USER_SUSPENDED)
          .error('Account suspended for policy violation')
          .send()
      } else {
        this.statusCode(BAD_REQUEST).errorCode(UNVERIFIED).error('Please verify your email').send()
      }
    }
  }

  async get({ uid }: any): Promise<void> {
    await this.ownerAndAdminAccess(uid)
    const user = await UserModel.findById(uid).exec()
    if (!user) this.status(false).statusCode(NOTFOUND).message('User not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(user).send()
  }

  async getProfile({ uid }: any): Promise<void> {
    await this.ownerAndAdminAccess(uid)
    const userProfile = await UserProfileModel.findOne({ uid }).exec()
    if (!userProfile) this.status(false).statusCode(NOTFOUND).message('User not found').send()
    else this.status(true).setData(userProfile).statusCode(GET_SUCCESS).send()
  }

  async getDetails({ uid }: any): Promise<void> {
    if (!uid) {
      uid = this?.user?._id
    }
    await this.ownerAndAdminAccess(uid)
    const user = await UserModel.findById(uid).exec()
    const userProfile = await UserProfileModel.findOne({ uid }).exec()
    const country = userProfile?.country && (await CountrieModel.find({ id: userProfile.country }).exec())
    const state = userProfile?.state && (await StateModel.find({ id: userProfile.state }).exec())
    if (!user) this.status(false).statusCode(NOTFOUND).message('User not found').send()
    else {
      const details = {
        state,
        country,
        ...((userProfile as any)?._doc || {}),
        ...((user as any)?._doc || {}),
      }
      this.status(true).statusCode(GET_SUCCESS).setData(details).send()
    }
  }

  async all() {
    await this.adminAccess()
    const users = await new PaginatingModel<IUser>(UserModel, this).exec()
    if (!users) this.status(false).statusCode(NOTFOUND).message('Users not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(users).send()
  }

  async profileAll() {
    await this.adminAccess()
    const userProfiles = await new PaginatingModel<IUserProfile>(UserProfileModel, this).exec()
    if (!userProfiles) this.status(false).statusCode(NOTFOUND).message('Users not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(userProfiles).send()
  }

  async create({ firstname, lastname, email, phone, password, refID }: any) {
    if (refID) {
      const referredBy = await UserModel.findOne({ _id: refID }).exec()
      if (!referredBy) {
        this.statusCode(BAD_REQUEST).errorCode(INVALID_REFID).message('Invalid referral ID').send()
      }
    }
    const _id = randomInt(1111111111, 9999999999)
    let user: IUser
    if (this.oauth2) {
      const names = this.oauth2.displayName.split(' ')
      user = await UserModel.create({
        _id,
        firstname: names[0],
        lastname: names[1],
        slug: `${names[0]} ${names[1]}`,
        email: this.oauth2?.emails && this.oauth2?.emails[0],
        oauth: true,
        status: ACTIVE,
      })
    } else {
      user = await UserModel.create({
        _id,
        firstname,
        lastname,
        email,
        password,
        phone,
        refID,
      })
    }
    await UserProfileModel.create({ uid: user._id })
    /* await new UserSetting(this.req, this.res, this.next).create({
      uid: user._id,
    }); */

    new Mailer()
      .setSubject('Welcome')
      .addRecipient({ name: user.firstname, address: user.email })
      .setBody(SharedConfig.get('WELCOME_TEMPLATE'), SharedConfig.get('SITE_URL'), 'Learn more')
      .send()

    !this.oauth2 &&
      new Mailer()
        .setSubject('Email Verification')
        .addRecipient({ name: user.firstname, address: user.email })
        .setBody(
          `
        <h2>Confirmation Code</h2>
        <p>Here is your confirmation code to get your account opened, if you did not initiated this request kindly ignore this message.</p>
        `,
          '#',
        )
        .sendConfirmationCode()

    this.oauth2 && (await this.login({}))

    this.statusCode(POST_SUCCESS)
      .success('Account Created. Check your mailbox for confirmation code')
      .uid(user._id)
      .send()
  }

  async update() {
    let avatar
    let filestore
    if (this.req.headers['content-type']?.includes('multipart')) {
      filestore = new FileStore(this, true)
      avatar = (await filestore.uploadFor('avatar')) || null
    }
    const {
      uid = this.user._id,
      firstname,
      lastname,
      email,
      role,
      bio,
      country,
      state,
      phone,
      slug,
      status,
    }: any = this.req.body
    await this.isValidUser(uid)
    await this.ownerAndAdminAccess(uid)

    const temp: any = {
      firstname,
      lastname,
      email,
      slug:
        slug &&
        slug
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+$/, ''),
      bio: bio?.substring(0, 500),
      avatar,
      phone,
      status: (await this.adminAccess(false)) ? status : ACTIVE,
    }

    if (role) {
      if (await this.developerAccess(false)) {
        temp.role = role
      }
    }

    const definedValues = getDefinedValuesFrom(temp)

    const userInfoUpdate: any = await UserModel.findByIdAndUpdate(uid, definedValues, {
      new: true,
    }).exec()

    const profile = getDefinedValuesFrom({
      country,
      state,
    })

    const profileModel = await UserProfileModel.findOne({ uid }).exec()
    if (avatar && profileModel?.avatar && profileModel?.avatar !== '') {
      filestore?.delete(profileModel?.avatar)
    }
    const userProfileUpdate: any = await UserProfileModel.findOneAndUpdate({ uid }, profile, {
      upsert: true,
      new: true,
    }).exec()

    this.statusCode(POST_SUCCESS)
      .success('User info updated successfully!')
      .uid(userInfoUpdate.uid)
      .setData({ ...userProfileUpdate, ...userInfoUpdate })
      .send()
  }

  async changePassword({ uid, oldPassword, newPassword }: any) {
    const user = await this.isValidUser(uid)

    !this.directRequest && (await this.ownerAndAdminAccess(uid))

    const definedValues = getDefinedValuesFrom({
      password: newPassword,
    })

    const userInfoUpdate: any = await UserModel.findOneAndUpdate(
      (!this.directRequest && !oldPassword) || !user?.password ? { _id: uid } : { _id: uid, password: oldPassword },
      definedValues,
      {
        new: true,
      },
    ).exec()

    if (!this.directRequest) {
      return userInfoUpdate || false
    }

    if (!userInfoUpdate) {
      this.statusCode(BAD_REQUEST).error('Incorrect password!').send()
    } else {
      this.statusCode(POST_SUCCESS)
        .success('Password changed')
        .uid(userInfoUpdate.uid)
        .setData(userInfoUpdate)
        .send()
    }
  }

  async changePin({ uid, otp, pin }: any) {
    uid = uid || this?.user?._id
    await this.isValidUser(uid)
    await this.ownerAndAdminAccess(uid)
    const auth = await UserEmailAuthenticationModel.findOneAndDelete({
      uid,
      code: otp,
    }).exec()

    if (!auth) {
      return this.statusCode(BAD_REQUEST).errorCode(INVALID_CONFIRMATION_CODE).error('Invalid OTP').send()
    }

    const exDuration = Date.now() - auth.duration

    if (exDuration > MIN * 10) {
      return this.statusCode(BAD_REQUEST).errorCode(EXPIRED_CONFIRMATION_CODE).error('OTP Expired').send()
    }

    const definedValues = getDefinedValuesFrom({
      pin,
    })

    const updated = await UserModel.findByIdAndUpdate(uid, {
      ...definedValues,
    }).exec()

    if (!this.directRequest) {
      return updated || false
    }

    this.statusCode(POST_SUCCESS).success('Pin changed').setData(updated).send()
  }

  async sendForgetPasswordMail({ email }: any) {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      this.statusCode(NOTFOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else {
      const code = rand(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }
      try {
        UserEmailAuthenticationModel.findOneAndUpdate({ uid: user._id }, auth, {
          upsert: true,
          new: true,
        }).exec()
      } catch (error) {
        /* empty */
      }
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('Forgot Password Verification')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Forgot Password Verification Code</h2>
        <p>Here is your verification code to change your password, if you did not initiated this request kindly ignore/delete this message.</p>
        `,
          SharedConfig.get('SITE_URL') + '/forget-password?vemail=' + email + '&vcode=' + code,
          `${code}`,
        )
        .send(false)
      if (sent.status) {
        this.statusCode(GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send()
      } else {
        this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send verification code to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async verifyForgetPassword({ uid, email, code, newPassword }: any) {
    const definedValues = getDefinedValuesFrom({
      email,
      uid,
    })
    const result = await UserEmailAuthenticationModel.findOneAndDelete({
      ...definedValues,
      code,
    }).exec()
    if (!result) {
      this.statusCode(BAD_REQUEST).errorCode(INVALID_CONFIRMATION_CODE).error('Wrong Email or Confirmation Code').send()
    } else {
      const exDuration = Date.now() - result.duration
      if (exDuration > MIN * 10) {
        this.statusCode(BAD_REQUEST).errorCode(EXPIRED_CONFIRMATION_CODE).error('Confirmation Code Expired').send()
      } else {
        this.directRequest = false
        const user = await UserModel.findOne({ email }).exec()
        const changed = await this.changePassword({
          uid: user?._id,
          newPassword,
        })
        this.directRequest = true
        changed
          ? this.statusCode(POST_SUCCESS).success('Password changed login and continue').send()
          : this.statusCode(BAD_REQUEST).error('Could not change your password try again').send()
      }
    }
  }

  async sendVerificationMail({ email }: any) {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      this.statusCode(NOTFOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else if (user.status === ACTIVE) {
      this.statusCode(BAD_REQUEST).errorCode(ALREADY_VERIFIED).error('User Already verified').send()
    } else {
      const code = rand(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }
      try {
        UserEmailAuthenticationModel.findOneAndUpdate({ uid: user._id }, auth, {
          upsert: true,
          new: true,
        }).exec()
      } catch (error) {
        /* empty */
      }
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('Email Verification')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Email Verification Code</h2>
        <p>Here is your verification code to get your account opened, if you did not initiated this request kindly ignore this message.</p>
        `,
          'javascript:void;',
          `${code}`,
        )
        .send(false)
      if (sent.status) {
        this.statusCode(GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send()
      } else {
        this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send verification code to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async sendOtpMail({ email }: any) {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      this.statusCode(NOTFOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else {
      const code = rand(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }
      try {
        UserEmailAuthenticationModel.findOneAndUpdate({ uid: user._id }, auth, {
          upsert: true,
          new: true,
        }).exec()
      } catch (error) {
        /* empty */
      }
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('OTP Request')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Authentication token</h2>
        <p>Here is your One Time Password Token, if you did not initiated this request kindly ignore this message.</p>
        `,
          'javascript:void;',
          `${code}`,
        )
        .send(false)
      if (sent.status) {
        this.statusCode(GET_SUCCESS).status(true).message(`OTP sent to ${email}`).send()
      } else {
        this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send OTP to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async verifyEmail({ uid, email, code }: any) {
    const definedValues = getDefinedValuesFrom({
      email,
      uid,
    })
    const result = await UserEmailAuthenticationModel.findOneAndDelete({
      ...definedValues,
      code,
    }).exec()
    if (!result) {
      this.statusCode(BAD_REQUEST).errorCode(INVALID_CONFIRMATION_CODE).error('Wrong Email or Confirmation Code').send()
    } else {
      const exDuration = Date.now() - result.duration
      if (exDuration > MIN * 10) {
        this.statusCode(BAD_REQUEST).errorCode(EXPIRED_CONFIRMATION_CODE).error('Confirmation Code Expired').send()
      } else {
        let u
        if (uid) {
          u = await UserModel.findByIdAndUpdate(uid, { status: ACTIVE }, { new: true }).exec()
        } else {
          u = await UserModel.findOneAndUpdate({ email }, { status: ACTIVE }, { new: true }).exec()
        }
        this.statusCode(GET_SUCCESS)
          .success(`${u?.firstname || uid} verified login and continue`)
          .send()
      }
    }
  }

  async googleOauth2() {
    const callbackURL = SharedConfig.get('SITE_URL') + '/auth/verify'
    passport.use(
      new Strategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL, // Adjust this callback URL
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (accessToken, refreshToken, profile, _done) => {
          // This function handles the user data after successful Google authentication
          // Add your logic to create or retrieve a user in your database based on the Google profile
          // Example:

          this.oauth2 = profile
          const existingUser = await UserModel.findOne({
            email: this.oauth2?.emails && this.oauth2?.emails[0].value,
          }).exec()
          if (existingUser) {
            await this.login({})
          } else {
            await this.create({})
          }
        },
      ),
    )

    passport.authenticate('google', { scope: ['profile', 'email'] }, () => {
      this.statusCode(BAD_AUTHENTICATION).error(`Could not verify your account`).send()
    })(this.req, this.res, this.next)
  }

  async delete({ uid }: any): Promise<void> {
    await this.developerAccess()
    const deleted = await UserModel.findByIdAndDelete(uid).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('User failed to be deleted do to error').send()
    else {
      try {
        await UserEmailAuthenticationModel.deleteMany({ uid }).exec()
      } catch (error) {}

      try {
        await UserProfileModel.deleteMany({ uid }).exec()
      } catch (error) {}

      try {
        await UserSettingModel.deleteMany({ uid }).exec()
      } catch (error) {}

      this.status(true).statusCode(POST_SUCCESS).message('User account deleted').setData(deleted).send()
    }
  }

  async deleteProfile({ uid }: any): Promise<void> {
    await this.adminAccess()
    const deleted = await UserModel.findOneAndDelete({ uid }).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('User Profile failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('User Profile deleted').setData(deleted).send()
  }
}

export default User
