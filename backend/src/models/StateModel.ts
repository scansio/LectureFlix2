import mongoose, { Schema } from 'mongoose'
import IState from '../types/IState'
import TimestampsPlugin from './plugins/TimestampsPlugin'

export const StateSchema = new Schema<IState>({
  id: String,
  name: String,
  country_id: String,
  country_code: String,
  iso2: String,
})

const StateModel = mongoose.model<IState>('State', TimestampsPlugin(StateSchema))
export default StateModel
