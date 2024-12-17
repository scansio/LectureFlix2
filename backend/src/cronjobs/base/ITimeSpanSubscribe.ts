import CronJob from './CronJob'

interface ITimeSpanSubscribe {
  addToMinuteJobs(job: typeof CronJob, span: number): void
  addToHourlyJobs(job: typeof CronJob): void
  addToHourJobs(job: typeof CronJob, span: number): void
  addToDaysJobs(job: typeof CronJob, span: number): void
  addToMonthJobs(job: typeof CronJob, span: number): void
  addToMonthlyJobs(job: typeof CronJob): void
  addToDailyJobs(job: typeof CronJob): void
  addToYearJobs(job: typeof CronJob, span: number): void
  addToYearlyJobs(job: typeof CronJob): void
}

export default ITimeSpanSubscribe
