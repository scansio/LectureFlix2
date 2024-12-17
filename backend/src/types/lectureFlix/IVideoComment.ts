import ITimestamp from '../ITimestamp'
import IVideo from './IVideo'

interface IVideoComment extends ITimestamp {
  video_id: IVideo['_id']
  comment_text: string
}

export default IVideoComment
