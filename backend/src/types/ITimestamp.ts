import { Document } from 'mongoose'
import IDate from './IDate'

interface ITimestamp extends Document {
  createdAt: IDate
  updatedAt: IDate
  status: number
}

export default ITimestamp
