import ISettingCategory from './ISettingCategory'
import ITimestamp from './ITimestamp'

interface ISetting extends ITimestamp {
  name: string
  value: string | number | undefined | null
  category: ISettingCategory['_id']
}

export default ISetting
