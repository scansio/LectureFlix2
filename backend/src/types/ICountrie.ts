import IDate from './IDate'
import { Document } from 'mongoose'

interface ICountrie extends Document {
  id: string
  name: string
  iso3: string
  numeric_code: string
  phonecode: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  region: string
  subregion: string
  emoji: string
  emojiU: string
  supported: boolean
  created_at: IDate | Date | string
  updated_at: IDate | Date | string
}

export default ICountrie
