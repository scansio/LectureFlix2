import mongoose, { Schema } from 'mongoose'
import IEmailAuth from '../types/IEmailAuth'
import TimestampsPlugin from './plugins/TimestampsPlugin'
import UserModel from './UserModel'

export const UserEmailAuthenticationSchema: Schema<IEmailAuth> = new Schema<IEmailAuth>({
  uid: {
    type: Number,
    ref: UserModel.modelName,
    required: [true, 'User ID is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  code: {
    type: Number,
    required: [true, 'Generated Code is required'],
  },
  extra: String,
  duration: {
    type: Number,
    required: [true, 'Specify time in milliseconds when the code is generated'],
  },
})

const UserEmailAuthenticationModel = mongoose.model<IEmailAuth>(
  'UserEmailAuthentication',
  TimestampsPlugin(UserEmailAuthenticationSchema),
)

export default UserEmailAuthenticationModel
