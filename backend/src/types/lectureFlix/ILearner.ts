import ITimestamp from '../ITimestamp'
import IVideo from './IVideo'

interface ILearner extends ITimestamp {
  full_name: string
  email: string
  password: string
  country: string
  date_of_birth: Date
}

export default ILearner
