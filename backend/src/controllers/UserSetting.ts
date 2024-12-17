/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import UserSettingModel from '../models/UserSettingModel'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'
import SettingModel from '../models/SettingModel'
import IUserSetting from '../types/IUserSetting'
import IPaginating from '../types/IPaginating'

class UserSetting extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async get({ name, uid }: any) {
    await this.ownerAndAdminAccess(uid || this?.user?._id)
    const userSettingModel = await UserSettingModel.findOne({
      uid,
      'setting.name': name,
    }).exec()
    if (!userSettingModel) this.status(false).statusCode(NOTFOUND).message('User setting not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(userSettingModel).send()
  }

  async all() {
    const userSettingsFn = async () =>
      await new PaginatingModel<IUserSetting>(UserSettingModel, this).populate('setting.category').exec()
    let userSettings = (await userSettingsFn()) as IPaginating<IUserSetting>
    if (!userSettings || userSettings?.results.length < 1) {
      this.directRequest = false //To reuse create function
      await this.create({ uid: this?.user?._id })
      this.directRequest = true //Set it back after using create function
      userSettings = (await userSettingsFn()) as IPaginating<IUserSetting>
    }
    this.status(true).statusCode(GET_SUCCESS).setData(userSettings).send()
  }

  async create({ uid }: any) {
    await this.ownerAndAdminAccess(uid || this?.user?._id)
    await UserSettingModel.deleteMany({ uid }).exec()
    const defaultSettings = await SettingModel.find().exec()
    for (const defaultSetting of defaultSettings) {
      try {
        await UserSettingModel.create({
          uid,
          setting: {
            name: defaultSetting?.name,
            value: defaultSetting?.value,
            category: defaultSetting?.category,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
    if (!this.directRequest) {
      const settings = await UserSettingModel.find({ uid }).exec()
      return settings
    }
    this.status(true).statusCode(POST_SUCCESS).message('User setting created').send()
  }

  async update({ uid, settings }: any) {
    if (!uid) {
      uid = this?.user?._id
    }
    await this.ownerAndAdminAccess(uid)
    if (Array.isArray(settings)) {
      for (const setting of settings) {
        const definedValues = getDefinedValuesFrom({
          name: setting?.name,
          value: setting?.value,
        })
        const settingModel = await SettingModel.findOne({
          name: definedValues?.name,
        }).exec()
        const existed = await UserSettingModel.findOneAndDelete({
          uid,
          'setting.name': definedValues?.name,
        }).exec()
        if (existed) {
          await UserSettingModel.create({
            uid,
            setting: {
              name: definedValues?.name,
              value: definedValues?.value,
              category: settingModel?.category,
            },
          })
        }
      }
    } else {
      const definedValues = getDefinedValuesFrom({
        name: settings?.name,
        value: settings?.value,
      })
      const settingModel = await SettingModel.findOne({
        'setting.name': definedValues?.name,
      }).exec()
      const existed = await UserSettingModel.findOneAndDelete({
        uid,
        name: definedValues?.name,
      }).exec()
      if (existed) {
        await UserSettingModel.create({
          uid,
          setting: {
            name: definedValues?.name,
            value: definedValues?.value,
            category: settingModel?.category,
          },
        })
      }
    }
    this.status(true).statusCode(POST_SUCCESS).message('User setting updated').send()
  }

  async reset({ uid }: any) {
    uid = uid || this?.user?._id
    await this.ownerAndAdminAccess(uid)
    const deleted = await UserSettingModel.deleteMany({ uid }).exec()
    this.directRequest = false //To reuse create function
    const recreated = deleted && (await this.create({ uid: uid || this?.user?._id }))
    this.directRequest = true //Set it back after using create function
    if (!recreated)
      this.status(false).statusCode(BAD_REQUEST).message('User setting failed to be reset do to error').send()
    else this.status(true).statusCode(GET_SUCCESS).message('User setting reseted').setData(recreated).send()
  }

  async delete({ id }: any) {
    await this.adminAccess()
    const deleted = await UserSettingModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('User setting failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('User setting deleted').setData(deleted).send()
  }
}

export default UserSetting
