import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IPayment from '../../types/lectureFlix/IPayment'

export const PaymentSchema: Schema<IPayment> = new Schema<IPayment>({
  learner_id: Schema.Types.ObjectId,
  amount: Number,
  payment_method: String,
})

const PaymentModel = mongoose.model<IPayment>('Payment', TimestampsPlugin(PaymentSchema))
export default PaymentModel
