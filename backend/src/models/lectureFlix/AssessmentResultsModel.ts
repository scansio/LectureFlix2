import mongoose, { Schema } from 'mongoose'
import TimestampsPlugin from '../plugins/TimestampsPlugin'
import IAssessmentResults from '../../types/lectureFlix/IAssessmentResults'

export const AssessmentResultsSchema: Schema<IAssessmentResults> = new Schema<IAssessmentResults>({
  user_id: String,
  course_id: String,
  assessment_score: String,
  assessment_date: String,
})

const AssessmentResultsModel = mongoose.model<IAssessmentResults>('AssessmentResults', TimestampsPlugin(AssessmentResultsSchema))
export default AssessmentResultsModel
