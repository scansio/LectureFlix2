"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
const BaseController_1 = __importDefault(require("./base/BaseController"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const UserProfileModel_1 = __importDefault(require("../models/UserProfileModel"));
const Authenticate_1 = __importDefault(require("../miscs/Authenticate"));
const common_1 = require("../common");
const md5_1 = require("../libs/md5");
const constants_1 = require("../configs/constants");
const Mailer_1 = __importDefault(require("../miscs/Mailer"));
const UserEmailAuthenticationModel_1 = __importDefault(require("../models/UserEmailAuthenticationModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const errorCodeConstants_1 = require("../configs/errorCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const FileStore_1 = __importDefault(require("../miscs/FileStore"));
const crypto_1 = require("crypto");
const CountrieModel_1 = __importDefault(require("../models/CountrieModel"));
const StateModel_1 = __importDefault(require("../models/StateModel"));
const UserSettingModel_1 = __importDefault(require("../models/UserSettingModel"));
const SharedConfig_1 = __importDefault(require("../libs/SharedConfig"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
class User extends BaseController_1.default {
    oauth2 = null;
    constructor(req, res, next) {
        super(req, res, next);
    }
    async logged() {
        this.status(true).message('Logged').send();
    }
    async login({ email, password }) {
        let isAdmin;
        if (await new Authenticate_1.default(this.req).verify()) {
            this.user = (0, common_1.getUser)(this.req);
            isAdmin = await this.adminAccess(false);
        }
        let user;
        if (isAdmin) {
            user = await UserModel_1.default.findOne({
                email,
            }).exec();
        }
        else if (this.oauth2) {
            user = await UserModel_1.default.findOne({
                email,
                oauth2: true,
            }).exec();
        }
        else {
            user = await UserModel_1.default.findOne({
                email,
                password,
            }).exec();
        }
        if (user == null) {
            if (isAdmin) {
                this.statusCode(statusCodeConstants_1.NOTFOUND).errorCode(errorCodeConstants_1.USER_NOTFOUND).error(`A user with email: ${email} does not exist`).send();
            }
            else {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST)
                    .error(this.oauth2 ? 'Could not verify your account try again shortly' : 'Invalid credentials.')
                    .send();
            }
        }
        else {
            if (isAdmin || user.status == constants_1.ACTIVE) {
                const authenticate = new Authenticate_1.default(this.req);
                const token = authenticate.generateToken({
                    ...user._doc,
                    uid: user._id,
                });
                this.status(true).message('Logged in').setData(token).uid(user._id).send();
            }
            else if (user.status == constants_1.HOTLISTED) {
                this.statusCode(statusCodeConstants_1.BAD_AUTHORIZATION)
                    .errorCode(errorCodeConstants_1.USER_SUSPENDED)
                    .error('Account suspended for policy violation')
                    .send();
            }
            else {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.UNVERIFIED).error('Please verify your email').send();
            }
        }
    }
    async get({ uid }) {
        await this.ownerAndAdminAccess(uid);
        const user = await UserModel_1.default.findById(uid).exec();
        if (!user)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('User not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(user).send();
    }
    async getProfile({ uid }) {
        await this.ownerAndAdminAccess(uid);
        const userProfile = await UserProfileModel_1.default.findOne({ uid }).exec();
        if (!userProfile)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('User not found').send();
        else
            this.status(true).setData(userProfile).statusCode(statusCodeConstants_1.GET_SUCCESS).send();
    }
    async getDetails({ uid }) {
        if (!uid) {
            uid = this?.user?._id;
        }
        await this.ownerAndAdminAccess(uid);
        const user = await UserModel_1.default.findById(uid).exec();
        const userProfile = await UserProfileModel_1.default.findOne({ uid }).exec();
        const country = userProfile?.country && (await CountrieModel_1.default.find({ id: userProfile.country }).exec());
        const state = userProfile?.state && (await StateModel_1.default.find({ id: userProfile.state }).exec());
        if (!user)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('User not found').send();
        else {
            const details = {
                state,
                country,
                ...(userProfile?._doc || {}),
                ...(user?._doc || {}),
            };
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(details).send();
        }
    }
    async all() {
        await this.adminAccess();
        const users = await new PaginatingModel_1.default(UserModel_1.default, this).exec();
        if (!users)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Users not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(users).send();
    }
    async profileAll() {
        await this.adminAccess();
        const userProfiles = await new PaginatingModel_1.default(UserProfileModel_1.default, this).exec();
        if (!userProfiles)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Users not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(userProfiles).send();
    }
    async create({ firstname, lastname, email, phone, password, refID }) {
        if (refID) {
            const referredBy = await UserModel_1.default.findOne({ _id: refID }).exec();
            if (!referredBy) {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.INVALID_REFID).message('Invalid referral ID').send();
            }
        }
        const _id = (0, crypto_1.randomInt)(1111111111, 9999999999);
        let user;
        if (this.oauth2) {
            const names = this.oauth2.displayName.split(' ');
            user = await UserModel_1.default.create({
                _id,
                firstname: names[0],
                lastname: names[1],
                slug: `${names[0]} ${names[1]}`,
                email: this.oauth2?.emails && this.oauth2?.emails[0],
                oauth: true,
                status: constants_1.ACTIVE,
            });
        }
        else {
            user = await UserModel_1.default.create({
                _id,
                firstname,
                lastname,
                email,
                password,
                phone,
                refID,
            });
        }
        await UserProfileModel_1.default.create({ uid: user._id });
        /* await new UserSetting(this.req, this.res, this.next).create({
          uid: user._id,
        }); */
        new Mailer_1.default()
            .setSubject('Welcome')
            .addRecipient({ name: user.firstname, address: user.email })
            .setBody(SharedConfig_1.default.get('WELCOME_TEMPLATE'), SharedConfig_1.default.get('SITE_URL'), 'Learn more')
            .send();
        !this.oauth2 &&
            new Mailer_1.default()
                .setSubject('Email Verification')
                .addRecipient({ name: user.firstname, address: user.email })
                .setBody(`
        <h2>Confirmation Code</h2>
        <p>Here is your confirmation code to get your account opened, if you did not initiated this request kindly ignore this message.</p>
        `, '#')
                .sendConfirmationCode();
        this.oauth2 && (await this.login({}));
        this.statusCode(statusCodeConstants_1.POST_SUCCESS)
            .success('Account Created. Check your mailbox for confirmation code')
            .uid(user._id)
            .send();
    }
    async update() {
        let avatar;
        let filestore;
        if (this.req.headers['content-type']?.includes('multipart')) {
            filestore = new FileStore_1.default(this, true);
            avatar = (await filestore.uploadFor('avatar')) || null;
        }
        const { uid = this.user._id, firstname, lastname, email, role, bio, country, state, phone, slug, status, } = this.req.body;
        await this.isValidUser(uid);
        await this.ownerAndAdminAccess(uid);
        const temp = {
            firstname,
            lastname,
            email,
            slug: slug &&
                slug
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+$/, ''),
            bio: bio?.substring(0, 500),
            avatar,
            phone,
            status: (await this.adminAccess(false)) ? status : constants_1.ACTIVE,
        };
        if (role) {
            if (await this.developerAccess(false)) {
                temp.role = role;
            }
        }
        const definedValues = (0, common_1.getDefinedValuesFrom)(temp);
        const userInfoUpdate = await UserModel_1.default.findByIdAndUpdate(uid, definedValues, {
            new: true,
        }).exec();
        const profile = (0, common_1.getDefinedValuesFrom)({
            country,
            state,
        });
        const profileModel = await UserProfileModel_1.default.findOne({ uid }).exec();
        if (avatar && profileModel?.avatar && profileModel?.avatar !== '') {
            filestore?.delete(profileModel?.avatar);
        }
        const userProfileUpdate = await UserProfileModel_1.default.findOneAndUpdate({ uid }, profile, {
            upsert: true,
            new: true,
        }).exec();
        this.statusCode(statusCodeConstants_1.POST_SUCCESS)
            .success('User info updated successfully!')
            .uid(userInfoUpdate.uid)
            .setData({ ...userProfileUpdate, ...userInfoUpdate })
            .send();
    }
    async changePassword({ uid, oldPassword, newPassword }) {
        const user = await this.isValidUser(uid);
        !this.directRequest && (await this.ownerAndAdminAccess(uid));
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            password: newPassword,
        });
        const userInfoUpdate = await UserModel_1.default.findOneAndUpdate((!this.directRequest && !oldPassword) || !user?.password ? { _id: uid } : { _id: uid, password: oldPassword }, definedValues, {
            new: true,
        }).exec();
        if (!this.directRequest) {
            return userInfoUpdate || false;
        }
        if (!userInfoUpdate) {
            this.statusCode(statusCodeConstants_1.BAD_REQUEST).error('Incorrect password!').send();
        }
        else {
            this.statusCode(statusCodeConstants_1.POST_SUCCESS)
                .success('Password changed')
                .uid(userInfoUpdate.uid)
                .setData(userInfoUpdate)
                .send();
        }
    }
    async changePin({ uid, otp, pin }) {
        uid = uid || this?.user?._id;
        await this.isValidUser(uid);
        await this.ownerAndAdminAccess(uid);
        const auth = await UserEmailAuthenticationModel_1.default.findOneAndDelete({
            uid,
            code: otp,
        }).exec();
        if (!auth) {
            return this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.INVALID_CONFIRMATION_CODE).error('Invalid OTP').send();
        }
        const exDuration = Date.now() - auth.duration;
        if (exDuration > constants_1.MIN * 10) {
            return this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.EXPIRED_CONFIRMATION_CODE).error('OTP Expired').send();
        }
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            pin,
        });
        const updated = await UserModel_1.default.findByIdAndUpdate(uid, {
            ...definedValues,
        }).exec();
        if (!this.directRequest) {
            return updated || false;
        }
        this.statusCode(statusCodeConstants_1.POST_SUCCESS).success('Pin changed').setData(updated).send();
    }
    async sendForgetPasswordMail({ email }) {
        const user = await UserModel_1.default.findOne({ email }).exec();
        if (!user) {
            this.statusCode(statusCodeConstants_1.NOTFOUND).errorCode(errorCodeConstants_1.USER_NOTFOUND).message('User Not Found').send();
        }
        else {
            const code = (0, md5_1.rand)(123456, 987654);
            const auth = {
                uid: user._id,
                code,
                email,
                duration: Date.now(),
            };
            try {
                UserEmailAuthenticationModel_1.default.findOneAndUpdate({ uid: user._id }, auth, {
                    upsert: true,
                    new: true,
                }).exec();
            }
            catch (error) {
                /* empty */
            }
            const mailer = new Mailer_1.default();
            const sent = await mailer
                .setSubject('Forgot Password Verification')
                .addRecipient({ name: user.firstname, address: email })
                .setBody(`
        <h2>Forgot Password Verification Code</h2>
        <p>Here is your verification code to change your password, if you did not initiated this request kindly ignore/delete this message.</p>
        `, SharedConfig_1.default.get('SITE_URL') + '/forget-password?vemail=' + email + '&vcode=' + code, `${code}`)
                .send(false);
            if (sent.status) {
                this.statusCode(statusCodeConstants_1.GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send();
            }
            else {
                this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE)
                    .errorCode(errorCodeConstants_1.SENDMAIL_ERROR)
                    .error(`Unable to send verification code to ${email}. Please try again shortly`)
                    .send();
            }
        }
    }
    async verifyForgetPassword({ uid, email, code, newPassword }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            email,
            uid,
        });
        const result = await UserEmailAuthenticationModel_1.default.findOneAndDelete({
            ...definedValues,
            code,
        }).exec();
        if (!result) {
            this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.INVALID_CONFIRMATION_CODE).error('Wrong Email or Confirmation Code').send();
        }
        else {
            const exDuration = Date.now() - result.duration;
            if (exDuration > constants_1.MIN * 10) {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.EXPIRED_CONFIRMATION_CODE).error('Confirmation Code Expired').send();
            }
            else {
                this.directRequest = false;
                const user = await UserModel_1.default.findOne({ email }).exec();
                const changed = await this.changePassword({
                    uid: user?._id,
                    newPassword,
                });
                this.directRequest = true;
                changed
                    ? this.statusCode(statusCodeConstants_1.POST_SUCCESS).success('Password changed login and continue').send()
                    : this.statusCode(statusCodeConstants_1.BAD_REQUEST).error('Could not change your password try again').send();
            }
        }
    }
    async sendVerificationMail({ email }) {
        const user = await UserModel_1.default.findOne({ email }).exec();
        if (!user) {
            this.statusCode(statusCodeConstants_1.NOTFOUND).errorCode(errorCodeConstants_1.USER_NOTFOUND).message('User Not Found').send();
        }
        else if (user.status === constants_1.ACTIVE) {
            this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.ALREADY_VERIFIED).error('User Already verified').send();
        }
        else {
            const code = (0, md5_1.rand)(123456, 987654);
            const auth = {
                uid: user._id,
                code,
                email,
                duration: Date.now(),
            };
            try {
                UserEmailAuthenticationModel_1.default.findOneAndUpdate({ uid: user._id }, auth, {
                    upsert: true,
                    new: true,
                }).exec();
            }
            catch (error) {
                /* empty */
            }
            const mailer = new Mailer_1.default();
            const sent = await mailer
                .setSubject('Email Verification')
                .addRecipient({ name: user.firstname, address: email })
                .setBody(`
        <h2>Email Verification Code</h2>
        <p>Here is your verification code to get your account opened, if you did not initiated this request kindly ignore this message.</p>
        `, 'javascript:void;', `${code}`)
                .send(false);
            if (sent.status) {
                this.statusCode(statusCodeConstants_1.GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send();
            }
            else {
                this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE)
                    .errorCode(errorCodeConstants_1.SENDMAIL_ERROR)
                    .error(`Unable to send verification code to ${email}. Please try again shortly`)
                    .send();
            }
        }
    }
    async sendOtpMail({ email }) {
        const user = await UserModel_1.default.findOne({ email }).exec();
        if (!user) {
            this.statusCode(statusCodeConstants_1.NOTFOUND).errorCode(errorCodeConstants_1.USER_NOTFOUND).message('User Not Found').send();
        }
        else {
            const code = (0, md5_1.rand)(123456, 987654);
            const auth = {
                uid: user._id,
                code,
                email,
                duration: Date.now(),
            };
            try {
                UserEmailAuthenticationModel_1.default.findOneAndUpdate({ uid: user._id }, auth, {
                    upsert: true,
                    new: true,
                }).exec();
            }
            catch (error) {
                /* empty */
            }
            const mailer = new Mailer_1.default();
            const sent = await mailer
                .setSubject('OTP Request')
                .addRecipient({ name: user.firstname, address: email })
                .setBody(`
        <h2>Authentication token</h2>
        <p>Here is your One Time Password Token, if you did not initiated this request kindly ignore this message.</p>
        `, 'javascript:void;', `${code}`)
                .send(false);
            if (sent.status) {
                this.statusCode(statusCodeConstants_1.GET_SUCCESS).status(true).message(`OTP sent to ${email}`).send();
            }
            else {
                this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE)
                    .errorCode(errorCodeConstants_1.SENDMAIL_ERROR)
                    .error(`Unable to send OTP to ${email}. Please try again shortly`)
                    .send();
            }
        }
    }
    async verifyEmail({ uid, email, code }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            email,
            uid,
        });
        const result = await UserEmailAuthenticationModel_1.default.findOneAndDelete({
            ...definedValues,
            code,
        }).exec();
        if (!result) {
            this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.INVALID_CONFIRMATION_CODE).error('Wrong Email or Confirmation Code').send();
        }
        else {
            const exDuration = Date.now() - result.duration;
            if (exDuration > constants_1.MIN * 10) {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.EXPIRED_CONFIRMATION_CODE).error('Confirmation Code Expired').send();
            }
            else {
                let u;
                if (uid) {
                    u = await UserModel_1.default.findByIdAndUpdate(uid, { status: constants_1.ACTIVE }, { new: true }).exec();
                }
                else {
                    u = await UserModel_1.default.findOneAndUpdate({ email }, { status: constants_1.ACTIVE }, { new: true }).exec();
                }
                this.statusCode(statusCodeConstants_1.GET_SUCCESS)
                    .success(`${u?.firstname || uid} verified login and continue`)
                    .send();
            }
        }
    }
    async googleOauth2() {
        const callbackURL = SharedConfig_1.default.get('SITE_URL') + '/auth/verify';
        passport_1.default.use(new passport_google_oauth2_1.Strategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL, // Adjust this callback URL
        }, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (accessToken, refreshToken, profile, _done) => {
            // This function handles the user data after successful Google authentication
            // Add your logic to create or retrieve a user in your database based on the Google profile
            // Example:
            this.oauth2 = profile;
            const existingUser = await UserModel_1.default.findOne({
                email: this.oauth2?.emails && this.oauth2?.emails[0].value,
            }).exec();
            if (existingUser) {
                await this.login({});
            }
            else {
                await this.create({});
            }
        }));
        passport_1.default.authenticate('google', { scope: ['profile', 'email'] }, () => {
            this.statusCode(statusCodeConstants_1.BAD_AUTHENTICATION).error(`Could not verify your account`).send();
        })(this.req, this.res, this.next);
    }
    async delete({ uid }) {
        await this.developerAccess();
        const deleted = await UserModel_1.default.findByIdAndDelete(uid).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('User failed to be deleted do to error').send();
        else {
            try {
                await UserEmailAuthenticationModel_1.default.deleteMany({ uid }).exec();
            }
            catch (error) { }
            try {
                await UserProfileModel_1.default.deleteMany({ uid }).exec();
            }
            catch (error) { }
            try {
                await UserSettingModel_1.default.deleteMany({ uid }).exec();
            }
            catch (error) { }
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('User account deleted').setData(deleted).send();
        }
    }
    async deleteProfile({ uid }) {
        await this.adminAccess();
        const deleted = await UserModel_1.default.findOneAndDelete({ uid }).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('User Profile failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('User Profile deleted').setData(deleted).send();
    }
}
exports.default = User;
