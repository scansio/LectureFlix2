import ITimestamp from '../ITimestamp'
import ICourse from './ICourse'

interface IVideo extends ITimestamp {
  course_id: ICourse['_id']
  video_title: string
  video_description: string
  upload_date: string
  video_access: string
}

export default IVideo
