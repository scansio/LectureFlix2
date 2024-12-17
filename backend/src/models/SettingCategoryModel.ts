import mongoose, { Schema } from 'mongoose'
import ISettingCategory from '../types/ISettingCategory'
import TimestampsPlugin from './plugins/TimestampsPlugin'

export const SettingCategorySchema: Schema<ISettingCategory> = new Schema<ISettingCategory>({
  name: String,
})

const SettingCategoryModel = mongoose.model<ISettingCategory>(
  `SettingCategory`,
  TimestampsPlugin(SettingCategorySchema),
)
export default SettingCategoryModel
