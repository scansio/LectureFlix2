import mongoose, { Schema } from 'mongoose'
import ICountrie from '../types/ICountrie'
import TimestampsPlugin from './plugins/TimestampsPlugin'

export const CountrieSchema = new Schema<ICountrie>({
  id: String,
  name: String,
  iso3: String,
  numeric_code: String,
  phonecode: String,
  capital: String,
  currency: String,
  currency_name: String,
  currency_symbol: String,
  region: String,
  subregion: String,
  emoji: String,
  emojiU: String,
  supported: Boolean,
})

const CountrieModel = mongoose.model<ICountrie>('Countrie', TimestampsPlugin(CountrieSchema))
export default CountrieModel
