import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IVideo from '../../types/lectureFlix/IVideo'

export const VideoSchema: Schema<IVideo> = new Schema<IVideo>({
  course_id: Schema.Types.ObjectId,
  video_title: String,
  video_description: String,
  upload_date: String,
  video_access: String,
})

const VideoModel = mongoose.model<IVideo>('Video', TimestampsPlugin(VideoSchema))
export default VideoModel
