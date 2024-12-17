/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import {
  didMonthStartedToday,
  isCurrentHourWithinStartOfTheDay,
  isCurrentMinuteStartOfHour,
  isTodayFirstDayOfTheYear,
} from '../../common'
import CronJob from './CronJob'
import ITimeSpanSubscribe from './ITimeSpanSubscribe'
import ITimeSpanValue from './ITimeSpanValue'
import TimeSpan from './TimeSpan'
import TimeSpanType from './TimeSpanType'

class TimeSpanSubscribe implements ITimeSpanSubscribe {
  readonly singleCycle = 1
  readonly initialCurrentCycle = 0

  readonly timeSpanSubscription: { [k: number]: ITimeSpanValue[] } = {
    [TimeSpan.MINUTE]: [],
    [TimeSpan.HOUR]: [],
    [TimeSpan.DAY]: [],
    [TimeSpan.MONTH]: [],
    [TimeSpan.YEAR]: [],
  }

  addToMinuteJobs(job: typeof CronJob, span: number = this.singleCycle): void {
    this.addJob({ job, span, type: TimeSpan.MINUTE })
  }

  addToHourlyJobs(job: typeof CronJob): void {
    this.addJob({ job, span: this.singleCycle, type: TimeSpan.HOUR })
  }

  addToHourJobs(job: typeof CronJob, span: number): void {
    this.addJob({ job, span, type: TimeSpan.HOUR })
  }

  addToDaysJobs(job: typeof CronJob, span: number): void {
    this.addJob({ job, span, type: TimeSpan.DAY })
  }

  addToMonthJobs(job: typeof CronJob, span: number): void {
    this.addJob({ job, span, type: TimeSpan.MONTH })
  }

  addToMonthlyJobs(job: typeof CronJob): void {
    this.addJob({ job, span: this.singleCycle, type: TimeSpan.MONTH })
  }

  addToDailyJobs(job: typeof CronJob): void {
    this.addJob({ job, span: this.singleCycle, type: TimeSpan.DAY })
  }

  addToYearJobs(job: typeof CronJob, span: number): void {
    this.addJob({ job, span, type: TimeSpan.YEAR })
  }

  addToYearlyJobs(job: typeof CronJob): void {
    this.addJob({ job, span: this.singleCycle, type: TimeSpan.YEAR })
  }

  addJob({
    job,
    span = this.singleCycle,
    type = TimeSpan.MINUTE,
  }: {
    job: typeof CronJob
    span: number
    type: TimeSpanType
  }) {
    switch (type) {
      case TimeSpan.MINUTE:
      case TimeSpan.HOUR:
      case TimeSpan.DAY:
      case TimeSpan.MONTH:
      case TimeSpan.YEAR:
        this.timeSpanSubscription[type].push({
          cycleAble: span > this.singleCycle,
          cycle: span,
          currentCycle: this.initialCurrentCycle,
          job,
        })
        break

      default:
        break
    }
  }

  runDueJobs() {
    for (const timeSpan in this.timeSpanSubscription) {
      const timeSpanSubscribers = this.timeSpanSubscription[timeSpan]

      switch (parseInt(timeSpan)) {
        case TimeSpan.MINUTE:
          for (const subscriber of timeSpanSubscribers) {
            this.setSubscriberCycleOrRun(subscriber)
          }
          break

        case TimeSpan.HOUR:
          const hourly = isCurrentMinuteStartOfHour()
          if (hourly) {
            for (const subscriber of timeSpanSubscribers) {
              this.setSubscriberCycleOrRun(subscriber)
            }
          }
          break

        case TimeSpan.DAY:
          const daily = isCurrentHourWithinStartOfTheDay()
          if (daily) {
            for (const subscriber of timeSpanSubscribers) {
              this.setSubscriberCycleOrRun(subscriber)
            }
          }
          break

        case TimeSpan.MONTH:
          const monthly = didMonthStartedToday()
          if (monthly) {
            for (const subscriber of timeSpanSubscribers) {
              this.setSubscriberCycleOrRun(subscriber)
            }
          }
          break

        case TimeSpan.YEAR:
          const yearly = isTodayFirstDayOfTheYear()
          if (yearly) {
            for (const subscriber of timeSpanSubscribers) {
              this.setSubscriberCycleOrRun(subscriber)
            }
          }
          break

        default:
          break
      }
    }
  }

  private setSubscriberCycleOrRun(subscriber: ITimeSpanValue) {
    if (subscriber.cycleAble) {
      if (subscriber.cycle - 1 == subscriber.currentCycle) {
        subscriber.currentCycle = 0
      } else {
        subscriber.currentCycle++
        return //Prevents job execution until cycle completion
      }
    }
    const job = new (subscriber.job as any)() as CronJob
    job.run()
  }
}

export default TimeSpanSubscribe
