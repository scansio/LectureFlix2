import ITimestamp from '../ITimestamp'

interface ICourse extends ITimestamp {
  course_name: string
  lecturer_id: string
  course_description: string
}

export default ICourse
