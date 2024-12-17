import mongoose from 'mongoose'
import IUserProfile from '../types/IUserProfile'
import TimestampsPlugin from './plugins/TimestampsPlugin'
import UserModel from './UserModel'

export const UserProfileSchema = new mongoose.Schema<IUserProfile>({
  uid: {
    type: Number,
    ref: UserModel.modelName,
    required: [true, 'User ID is required'],
  },
  country: Number,
  state: Number,
})

const UserProfileModel = mongoose.model<IUserProfile>('UserProfile', TimestampsPlugin(UserProfileSchema))

export default UserProfileModel
