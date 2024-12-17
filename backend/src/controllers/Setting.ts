/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import SettingModel from '../models/SettingModel'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'
import IUser from '../types/IUser'
import ISetting from '../types/ISetting'

class Setting extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await SettingModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Setting not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const settings = await new PaginatingModel<ISetting>(SettingModel, this).exec()
    if (!settings) this.status(false).statusCode(NOTFOUND).message('Setting not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(settings).send()
  }

  async create({ name, value, category }: any) {
    const created = await SettingModel.create({
      name,
      value,
      category,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Setting').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Setting created').setData(created).send()
  }

  async update({ id, name, value, category }: any) {
    const definedValues = getDefinedValuesFrom({
      name,
      value,
      category,
    })
    const updated = await SettingModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Setting failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Setting updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await SettingModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Setting failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Setting deleted').setData(deleted).send()
  }
}

export default Setting
