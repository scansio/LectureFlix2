import ITimestamp from '../ITimestamp'

interface IAssessmentResults extends ITimestamp {
  user_id: string
  course_id: string
  assessment_score: string
  assessment_date: string
}

export default IAssessmentResults
