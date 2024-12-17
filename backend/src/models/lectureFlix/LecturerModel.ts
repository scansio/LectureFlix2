import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ILecturer from '../../types/lectureFlix/ILecturer'

export const LecturerSchema: Schema<ILecturer> = new Schema<ILecturer>({
  full_name: String,
  email: String,
  expertise: String,
  university_id: String,
})

const LecturerModel = mongoose.model<ILecturer>('Lecturer', TimestampsPlugin(LecturerSchema))
export default LecturerModel
