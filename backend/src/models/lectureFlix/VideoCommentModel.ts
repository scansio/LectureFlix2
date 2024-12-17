import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IVideoComment from '../../types/lectureFlix/IVideoComment'

export const VideoCommentSchema: Schema<IVideoComment> = new Schema<IVideoComment>({
  video_id: Schema.Types.ObjectId,
  comment_text: String,
})

const VideoCommentModel = mongoose.model<IVideoComment>('VideoComment', TimestampsPlugin(VideoCommentSchema))
export default VideoCommentModel
