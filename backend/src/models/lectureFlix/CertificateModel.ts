import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import ICertificate from '../../types/lectureFlix/ICertificate'

export const CertificateSchema: Schema<ICertificate> = new Schema<ICertificate>({
  user_id: String,
  course_id: String,
  certificate_number: String,
  issued_date: String,
})

const CertificateModel = mongoose.model<ICertificate>('Certificate', TimestampsPlugin(CertificateSchema))
export default CertificateModel
