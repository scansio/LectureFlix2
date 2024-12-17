/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import SettingCategoryModel from '../models/SettingCategoryModel'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'
import IUser from '../types/IUser'
import ISettingCategory from '../types/ISettingCategory'

class SettingCategory extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await SettingCategoryModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Category not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const settingCategories = await new PaginatingModel<ISettingCategory>(SettingCategoryModel, this).exec()
    if (!settingCategories) this.status(false).statusCode(NOTFOUND).message('Setting Categories not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(settingCategories).send()
  }

  async create({ name }: any) {
    const created = await SettingCategoryModel.create({
      name,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Category').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Category created').setData(created).send()
  }

  async update({ id, name }: any) {
    const definedValues = getDefinedValuesFrom({
      name,
    })
    const updated = await SettingCategoryModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Category failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Category updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await SettingCategoryModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Category failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Category deleted').setData(deleted).send()
  }
}

export default SettingCategory
