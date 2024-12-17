import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ICourseVideo from '../../types/lectureFlix/ICourseVideo'

export const CourseVideoSchema: Schema<ICourseVideo> = new Schema<ICourseVideo>({
  course_id: Schema.Types.ObjectId,
  video_id: Schema.Types.ObjectId,
})

const CourseVideoModel = mongoose.model<ICourseVideo>('CourseVideo', TimestampsPlugin(CourseVideoSchema))
export default CourseVideoModel
