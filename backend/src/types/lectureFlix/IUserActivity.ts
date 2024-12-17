import ITimestamp from '../ITimestamp'

interface IUserActivity extends ITimestamp {
  user_id: string
  activity_type: string
  activity_timestamp: string
}

export default IUserActivity
