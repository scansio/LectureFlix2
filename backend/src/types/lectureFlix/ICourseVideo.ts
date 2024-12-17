import ITimestamp from '../ITimestamp'
import ICourse from './ICourse'
import IVideo from './IVideo'

interface ICourseVideo extends ITimestamp {
  course_id: ICourse['_id']
  video_id: IVideo['_id']
}

export default ICourseVideo
