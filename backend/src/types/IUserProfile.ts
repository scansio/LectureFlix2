import ITimestamp from './ITimestamp'
import IUser from './IUser'

interface IUserProfile extends ITimestamp {
  uid: IUser['_id']
  country: number
  state: number
  phone: number
  bio: string
  avatar: string
}
export default IUserProfile
