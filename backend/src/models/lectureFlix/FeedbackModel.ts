import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IFeedback from '../../types/lectureFlix/IFeedback'

export const FeedbackSchema: Schema<IFeedback> = new Schema<IFeedback>({
  user_id: String,
  course_id: String,
  feedback_text: String,
  rating: String,
  submitted_at: String,
})

const FeedbackModel = mongoose.model<IFeedback>('Feedback', TimestampsPlugin(FeedbackSchema))
export default FeedbackModel
