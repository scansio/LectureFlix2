import ITimestamp from '../ITimestamp'

interface ICourseProgress extends ITimestamp {
  user_id: string
  course_id: string
  progress_percentage: string
  progressStatus: string
  last_updated: string
}

export default ICourseProgress
