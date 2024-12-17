/* eslint-disable @typescript-eslint/no-explicit-any */
//import Logger from '../../miscs/Logger'
import Logger from '../../miscs/Logger'
import TimeSpan from './TimeSpan'
import TimeSpanType from './TimeSpanType'

abstract class CronJob {
  static type: TimeSpanType = TimeSpan.MINUTE
  static span: number = 1

  protected abstract job(...criteriaValue: any): Promise<any>

  protected async criteria(): Promise<any> {
    return false
  }

  public run() {
    this.criteria()
      .then((_criteria) => {
        if (_criteria) {
          this.job(_criteria).catch((error) => {
            Logger.log('error', error)
          })
        }
      })
      .catch(() => {})
  }
}

export default CronJob
