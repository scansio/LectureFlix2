/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import UserLogModel from '../../models/lectureFlix/UserLogModel'
import PaginatingModel from '../../models/PaginatingModel'
import IUserLog from '../../types/lectureFlix/IUserLog'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class UserLog extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await UserLogModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('UserLog not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const UserLogs = await new PaginatingModel<IUserLog>(UserLogModel, this).makePublic(true).exec()
    if (!UserLogs) this.status(false).statusCode(NOTFOUND).message('No UserLogs').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(UserLogs).send()
  }

  async create({ learner_id, login_time, logout_time }: any) {
    const created = await UserLogModel.create({
      learner_id,
      login_time,
      logout_time,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating UserLog').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserLog created').setData(created).send()
  }

  async update({ id, learner_id, login_time, logout_time, status }: any) {
    const definedValues = getDefinedValuesFrom({
      learner_id,
      login_time,
      logout_time,
      status,
    })
    const updated = await UserLogModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('UserLog failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserLog updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await UserLogModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('UserLog failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserLog deleted').setData(deleted).send()
  }
}

export default UserLog
