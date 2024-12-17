import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ILearner from '../../types/lectureFlix/ILearner'

export const LearnerSchema: Schema<ILearner> = new Schema<ILearner>({
  full_name: String,
  email: String,
  password: String,
  country: String,
  date_of_birth: Date,
})

const LearnerModel = mongoose.model<ILearner>('Learner', TimestampsPlugin(LearnerSchema))
export default LearnerModel
