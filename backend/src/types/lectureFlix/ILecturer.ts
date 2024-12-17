import ITimestamp from '../ITimestamp'

interface ILecturer extends ITimestamp {
  full_name: string
  email: string
  expertise: string
  university_id: string
}

export default ILecturer
