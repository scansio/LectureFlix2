import { Schema } from 'mongoose'
import { Document } from 'mongoose'

interface IDate extends Document {
  timeString: string
  dateString: string
  time: number
  date: string
}

export const DateSchema = new Schema<IDate>({
  timeString: String,
  dateString: String,
  time: Number,
  date: String,
})

export default IDate
