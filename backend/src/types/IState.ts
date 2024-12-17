import IDate from './IDate'
import { Document } from 'mongoose'

interface IState extends Document {
  id: string
  name: string
  country_id: string
  country_code: string
  iso2: string
  created_at: IDate | Date | string
  updated_at: IDate | Date | string
}

export default IState
