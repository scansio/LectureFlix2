import IUser from './IUser'
import ITimestamp from './ITimestamp'
import ISetting from './ISetting'

interface IUserSetting extends ITimestamp {
  uid: IUser['_id']
  setting: ISetting
  settingSupported: boolean
}

export default IUserSetting
