import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IUserActivity from '../../types/lectureFlix/IUserActivity'

export const UserActivitySchema: Schema<IUserActivity> = new Schema<IUserActivity>({
  user_id: String,
  activity_type: String,
  activity_timestamp: String,
})

const UserActivityModel = mongoose.model<IUserActivity>('UserActivity', TimestampsPlugin(UserActivitySchema))
export default UserActivityModel
