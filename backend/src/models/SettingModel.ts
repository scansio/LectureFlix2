import mongoose, { Schema, SchemaTypes } from 'mongoose'
import ISetting from '../types/ISetting'
import TimestampsPlugin from './plugins/TimestampsPlugin'
import SettingCategoryModel from './SettingCategoryModel'

export const SettingSchema = new Schema<ISetting>({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required'],
  },
  value: {
    type: SchemaTypes.Mixed,
    required: [true, 'Value is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SettingCategoryModel.modelName,
    required: [true, 'Category ID is required'],
  },
})

const SettingModel = mongoose.model<ISetting>(`Setting`, TimestampsPlugin(SettingSchema))
export default SettingModel
