import ITimestamp from '../ITimestamp'
import ILearner from './ILearner'
import IVideo from './IVideo'

interface ISubscription extends ITimestamp {
  learner_id: ILearner['_id']
  subscription_type: string
  start_date: Date
  end_date: Date
}

export default ISubscription
