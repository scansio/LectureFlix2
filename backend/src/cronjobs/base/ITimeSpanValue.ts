import CronJob from './CronJob'

interface ITimeSpanValue {
  cycleAble: boolean
  cycle: number
  currentCycle: number
  job: typeof CronJob
}

export default ITimeSpanValue
