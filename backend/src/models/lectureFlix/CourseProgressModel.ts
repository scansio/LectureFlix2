import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ICourseProgress from '../../types/lectureFlix/ICourseProgress'

export const CourseProgressSchema: Schema<ICourseProgress> = new Schema<ICourseProgress>({
  user_id: String,
  course_id: String,
  progress_percentage: String,
  progressStatus: String,
  last_updated: String,
})

const CourseProgressModel = mongoose.model<ICourseProgress>('CourseProgress', TimestampsPlugin(CourseProgressSchema))
export default CourseProgressModel
