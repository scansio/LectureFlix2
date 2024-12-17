import ITimestamp from '../ITimestamp'

interface IFeedback extends ITimestamp {
  user_id: string
  course_id: string
  feedback_text: string
  rating: string
  submitted_at: string
}

export default IFeedback
