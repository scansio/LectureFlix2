import ITimestamp from '../ITimestamp'
import ILearner from './ILearner'
import IVideo from './IVideo'

interface IUserLog extends ITimestamp {
  learner_id: ILearner['_id']
  login_time: Date
  logout_time: Date
}

export default IUserLog
