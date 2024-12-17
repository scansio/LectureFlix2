/* eslint-disable @typescript-eslint/no-explicit-any */
import { opendir } from 'fs/promises'
import path from 'path'
import CronJob from '../base/CronJob'
//import Logger from '../../miscs/Logger'
import { MINUTE } from '../../configs/constants'
import TimeSpanSubscribe from '../base/TimeSpanSubscribe'
import Logger from '../../miscs/Logger'
import SharedConfig from '../../libs/SharedConfig'
import IOption from '../../types/IOption'
import OptionModel from '../../models/OptionModel'

class CronDefinition {
  private intervalInMillis = MINUTE
  private timeSpanSubscribe: TimeSpanSubscribe = new TimeSpanSubscribe()
  private jobsPath
  private oneTimeJobsPath

  constructor() {
    this.jobsPath = path.resolve(__dirname, '../jobs')
    this.oneTimeJobsPath = path.resolve(__dirname, '../onetimejobs')
  }

  public setJobsPath(pathname: string) {
    this.jobsPath = path.resolve(__dirname, pathname)
    return this
  }

  async loadJobs() {
    try {
      const dir = await opendir(this.jobsPath)

      for await (const dirent of dir) {
        if (dirent.isFile() && dirent.name.endsWith('.js')) {
          const cronJobFile = path.resolve(`${this.jobsPath}`, `${dirent.name}`)
          let cronJob
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            cronJob = require(cronJobFile).default as typeof CronJob
          } catch (error) {
            Logger.log('error', error)
            //console.log(error, '\n\n')
          }
          if (cronJob) {
            this.timeSpanSubscribe.addJob({
              job: cronJob,
              span: cronJob.span,
              type: cronJob.type,
            })
          }
        }
      }
    } catch (error) {
      Logger.log('error', error)
      //console.log(error, '\n\n')
    }
  }

  async loadOneTimeJobs() {
    try {
      const dir = await opendir(this.oneTimeJobsPath)

      for await (const dirent of dir) {
        if (dirent.isFile() && dirent.name.endsWith('.js')) {
          const cronJobFile = path.resolve(`${this.oneTimeJobsPath}`, `${dirent.name}`)
          let cronJob
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            cronJob = require(cronJobFile).default as any
          } catch (error) {
            Logger.log('error', error)
            //console.log(error, '\n\n')
          }
          if (cronJob) {
            new cronJob().run()
          }
        }
      }
    } catch (error) {
      Logger.log('error', error)
      //console.log(error, '\n\n')
    }
  }

  async start() {
    SharedConfig.set(process.env)

    const options: IOption[] = await OptionModel.find().exec()
    for (const option of options) {
      SharedConfig.set(option.name, option.value)
    }

    this.loadOneTimeJobs()
    this.loadJobs()
    setInterval(() => this.timeSpanSubscribe.runDueJobs(), this.intervalInMillis)
  }
}

export default CronDefinition
