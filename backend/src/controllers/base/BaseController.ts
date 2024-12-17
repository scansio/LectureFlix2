/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import Sender from './Sender'
import AllError from '../../exceptions/base/AllError'
import UserModel from '../../models/UserModel'
import {
  AuthenticationLevel,
  MAXIMUM_DEPOSIT_AMOUNT,
  MINIMUM_DEPOSIT_AMOUNT,
  TransactionType,
} from '../../configs/constants'
import IUser from '../../types/IUser'
import { BAD_AUTHORIZATION, BAD_REQUEST, GET_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import {
  INCORRECT_TRANSACTION_PIN,
  INVALID_AMOUNT,
  OUT_OF_BOUNDARY,
  USER_NOTFOUND,
} from '../../configs/errorCodeConstants'
import IOption from '../../types/IOption'
import OptionModel from '../../models/OptionModel'
import SharedConfig from '../../libs/SharedConfig'
import { getUser } from '../../common'
import MaintenanceException from '../../exceptions/MaintenanceException'
import AuthenticationException from '../../exceptions/AuthenticationException'
import { HydratedDocument, Model } from 'mongoose'

class BaseController extends Sender {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  public error404() {
    const error = new AllError('Route method not found')
    error.status = NOTFOUND
    throw error
  }

  async initConstruct() {
    SharedConfig.set('controller', this)
    SharedConfig.set('user', getUser(this.req))
    SharedConfig.set('response', this.res)
    SharedConfig.set('request', this.req)

    SharedConfig.set(process.env)

    const options: IOption[] = await OptionModel.find().exec()
    for (const option of options) {
      SharedConfig.set(option.name, option.value)
    }
    if (this.isPrivateRoute) {
      switch (this.isPrivateRoute) {
        case AuthenticationLevel.END_USER:
          {
            await this.ownerAndAdminAccess(SharedConfig.get('user')?._id)
          }

          break

        case AuthenticationLevel.ADMIN:
          {
            await this.adminAccess()
          }
          break

        case AuthenticationLevel.DEVELOPER:
          {
            await this.developerAccess()
          }
          break

        default:
          throw new AuthenticationException(this)
          break
      }
    }

    //if (this.isPrivateRoute) {
    //Access to option are allowed even if site is under maintenance
    if (this.executingClassName !== 'Option') {
      const developers = await this.developerAccess(false)
      const admins = await this.adminAccess(false)

      //Blocks everyone except developers from accessing the api
      if (!developers && SharedConfig.get('SERVER_MAINTENANCE')) {
        throw new MaintenanceException(this)
      }

      //Allows only admins and developers access the api
      if (!admins && SharedConfig.get('BLOCK_ALL_USERS')) {
        throw new MaintenanceException(this)
      }

      //Blocks all admins from accessing the api
      if (!developers && admins && SharedConfig.get('BLOCK_ALL_ADMIN')) {
        throw new MaintenanceException(this)
      }
    }
    //}
  }

  adminAccess(throwException = true): IUser | null | undefined | boolean {
    const user = this?.user
    if (!user || (user.role !== AuthenticationLevel.DEVELOPER && user.role !== AuthenticationLevel.ADMIN)) {
      if (throwException) {
        this.statusCode(BAD_AUTHORIZATION).errorCode(OUT_OF_BOUNDARY).error('Out of Boundary').send()
      }
      return null
    }
    return user
  }

  developerAccess(throwException = true): IUser | null | undefined | boolean {
    const user = this?.user
    if (!user || user.role !== AuthenticationLevel.DEVELOPER) {
      if (throwException) {
        this.statusCode(BAD_AUTHORIZATION).errorCode(OUT_OF_BOUNDARY).error('Out of Boundary').send()
      }
      return null
    }
    return user
  }

  ownerAccess(uid: IUser['_id'], throwException = true) {
    if (this?.user?._id == uid) {
      return true
    } else {
      if (throwException) {
        this.errorCode(OUT_OF_BOUNDARY)
          .statusCode(BAD_AUTHORIZATION)
          .error("You don't have access to this resource")
          .send()
      }
    }
    return false
  }

  async ownerAndAdminAccess(uid: IUser['_id'], throwException = true) {
    if (this.cronJobAccess) {
      return true
    }
    const adminAccess = await this.adminAccess(false)
    if (adminAccess || this?.user?._id == uid) {
      return true
    } else {
      if (throwException) {
        this.errorCode(OUT_OF_BOUNDARY)
          .statusCode(BAD_AUTHORIZATION)
          .error("You don't have access to this resource")
          .send()
      }
    }
    return false
  }

  checkZeroAmount(amount: number, throwException = true) {
    if (!amount || amount <= 0) {
      if (throwException)
        this.status(false)
          .statusCode(BAD_REQUEST)
          .errorCode(INVALID_AMOUNT)
          .message("Amount can't be less than 0")
          .send()
      else return false
    }
    return amount
  }

  isValidTransactionType(type: TransactionType, throwException = true) {
    switch (type) {
      case TransactionType.DEPOSIT:
      case TransactionType.WITHDRAW:
        break

      default:
        if (throwException)
          this.status(false)
            .statusCode(BAD_REQUEST)
            .errorCode(INVALID_AMOUNT)
            .message('Invalid transaction type')
            .send()
        else return false
        break
    }
    return type
  }

  checkMinMaxDepositAmount(amount: number, throwException = true) {
    this.checkZeroAmount(amount)
    const minAmountDeposit = SharedConfig.get(MINIMUM_DEPOSIT_AMOUNT) || 1000
    const maxAmountDeposit = SharedConfig.get(MAXIMUM_DEPOSIT_AMOUNT) || 4999999

    if (amount < minAmountDeposit || amount < maxAmountDeposit) {
      if (throwException)
        this.status(false)
          .statusCode(BAD_REQUEST)
          .errorCode(INVALID_AMOUNT)
          .message(`Amount can't be less than ${minAmountDeposit} or greater than ${maxAmountDeposit}`)
          .send()
      else return false
    }
    return amount
  }

  async isValidUser(uid: IUser['_id'], throwException = true) {
    const user = await UserModel.findById(uid).exec()
    if (user) {
      return user
    } else {
      if (throwException) {
        this.statusCode(BAD_REQUEST).errorCode(USER_NOTFOUND).error('User does not exist').send()
      }
    }
    return null
  }

  async isValidUserPin(uid: IUser['_id'], pin: string | number, throwException = true) {
    const user = await UserModel.findOne({ _id: uid, pin }).exec()
    if (pin && `${pin}`.trim() !== '' && user) {
      return user
    } else {
      if (throwException) {
        this.statusCode(BAD_REQUEST)
          .errorCode(INCORRECT_TRANSACTION_PIN)
          .error('Incorrect pin OR Create transaction pin in Setting > Change Pin')
          .send()
      }
    }
    return null
  }

  async like<T>({ model, id }: { model: Model<T>; id: string }) {
    const found: HydratedDocument<{ likeByIds: number[] }, {}, {}> | null = (await model
      .findById(`${id}`)
      .exec()) as any
    if (!found)
      this.status(false)
        .statusCode(NOTFOUND)
        .message(model.modelName + ' not found')
        .send()
    else {
      let liked = false
      if (found.likeByIds?.includes(this.user._id)) {
        found.likeByIds = found.likeByIds.filter((likedById) => likedById != this.user._id)
      } else {
        found.likeByIds.push(this.user._id)
        liked = true
      }
      await found.save()
      this.status(true)
        .statusCode(GET_SUCCESS)
        .setData({ [model.modelName]: found, liked: liked })
        .message(liked ? 'Liked' : 'Unliked')
        .send()
    }
  }
}

export default BaseController
