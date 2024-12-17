import mongoose, { Schema } from 'mongoose'
import IUserSetting from '../types/IUserSetting'
import TimestampsPlugin from './plugins/TimestampsPlugin'
import { SchemaTypes } from 'mongoose'
import ISetting from '../types/ISetting'
import SettingCategoryModel from './SettingCategoryModel'
import UserModel from './UserModel'

export const SettingSchema = new Schema<ISetting>({
  name: String,
  value: SchemaTypes.Mixed,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SettingCategoryModel.modelName,
    required: [true, 'Category ID is required'],
  },
})

export const UserSettingSchema = new Schema<IUserSetting>({
  uid: {
    type: Number,
    ref: UserModel.modelName,
    required: [true, 'User ID is required'],
  },
  setting: {
    type: SettingSchema,
    required: [true, 'Setting required'],
  },
  settingSupported: Boolean,
})

const UserSettingModel = mongoose.model<IUserSetting>(`UserSetting`, TimestampsPlugin(UserSettingSchema))
export default UserSettingModel
