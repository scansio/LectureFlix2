import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ISubscription from '../../types/lectureFlix/ISubscription'

export const SubscriptionSchema: Schema<ISubscription> = new Schema<ISubscription>({
  learner_id: Schema.Types.ObjectId,
  subscription_type: String,
  start_date: Date,
  end_date: Date,
})

const SubscriptionModel = mongoose.model<ISubscription>('Subscription', TimestampsPlugin(SubscriptionSchema))
export default SubscriptionModel
