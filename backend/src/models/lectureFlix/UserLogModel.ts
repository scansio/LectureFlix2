import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IUserLog from '../../types/lectureFlix/IUserLog'

export const UserLogSchema: Schema<IUserLog> = new Schema<IUserLog>({
  learner_id: Schema.Types.ObjectId,
  login_time: Date,
  logout_time: Date,
})

const UserLogModel = mongoose.model<IUserLog>('UserLog', TimestampsPlugin(UserLogSchema))
export default UserLogModel
