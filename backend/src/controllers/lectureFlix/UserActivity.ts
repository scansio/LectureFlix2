/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import UserActivityModel from '../../models/lectureFlix/UserActivityModel'
import PaginatingModel from '../../models/PaginatingModel'
import IUserActivity from '../../types/lectureFlix/IUserActivity'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class UserActivity extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await UserActivityModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('UserActivity not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const UserActivitys = await new PaginatingModel<IUserActivity>(UserActivityModel, this).makePublic(true).exec()
    if (!UserActivitys) this.status(false).statusCode(NOTFOUND).message('No UserActivitys').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(UserActivitys).send()
  }

  async create({ user_id, activity_type, activity_timestamp }: any) {
    const created = await UserActivityModel.create({
      user_id,
      activity_type,
      activity_timestamp,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating UserActivity').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserActivity created').setData(created).send()
  }

  async update({ id, user_id, activity_type, activity_timestamp, status }: any) {
    const definedValues = getDefinedValuesFrom({
      user_id,
      activity_type,
      activity_timestamp,
      status,
    })
    const updated = await UserActivityModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated)
      this.status(false).statusCode(BAD_REQUEST).message('UserActivity failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserActivity updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await UserActivityModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('UserActivity failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('UserActivity deleted').setData(deleted).send()
  }
}

export default UserActivity
