import ITimestamp from '../ITimestamp'
import ILearner from './ILearner'
import IVideo from './IVideo'

interface ICertificate extends ITimestamp {
  user_id: string
  course_id: string
  certificate_number: string
  issued_date: string
}

export default ICertificate
