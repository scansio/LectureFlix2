import mongoose, { Model, Schema } from 'mongoose'
import IOption from '../types/IOption'
import TimestampsPlugin from './plugins/TimestampsPlugin'

interface Statics extends Model<IOption> {
  get(name: string, value?: boolean): Promise<string | number | null | undefined | Date | boolean>
}

export const OptionSchema = new Schema<IOption, Statics>({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required'],
  },
  value: {
    type: mongoose.SchemaTypes.Mixed,
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
})

OptionSchema.static('get', async function (name: string, value = true) {
  const option = await this.findOne({ name }).exec()
  return value ? option?.value : option
})

const OptionModel = mongoose.model<IOption, Statics>(`Option`, TimestampsPlugin(OptionSchema))
export default OptionModel
