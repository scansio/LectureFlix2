import ITimestamp from '../ITimestamp'
import ILearner from './ILearner'
import IVideo from './IVideo'

interface IPayment extends ITimestamp {
  learner_id: ILearner['_id']
  amount: number
  payment_method: string
}

export default IPayment
