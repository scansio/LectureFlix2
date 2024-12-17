import ITimestamp from './ITimestamp'

interface IOption extends ITimestamp {
  name: string
  value: string | number | Date | null | undefined
  description: string
  isPublic?: boolean
}

export default IOption
