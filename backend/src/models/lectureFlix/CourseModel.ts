import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ICourse from '../../types/lectureFlix/ICourse'

export const CourseSchema: Schema<ICourse> = new Schema<ICourse>({
  course_name: String,
  lecturer_id: String,
  course_description: String,
})

const CourseModel = mongoose.model<ICourse>('Course', TimestampsPlugin(CourseSchema))
export default CourseModel
