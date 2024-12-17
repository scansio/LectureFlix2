/* eslint-disable @typescript-eslint/no-explicit-any */
import CronJob from '../base/CronJob'
import TimeSpan from '../base/TimeSpan'
import { EXPORT_DIRNAME, MIGRATE_DATA_URL, SERVER_UPDATE_DATA_URL } from '../../configs/constants'
import MigrationModel from '../../models/MigrationModel'
import RepoHooks from '../../RepoHooks'
import Logger from '../../miscs/Logger'
import axios from 'axios'

class DoBackupORANDPush extends CronJob {
  static type = TimeSpan.MINUTE
  //Runs every 30 minutes
  static span = 30

  async criteria() {
    return true
  }

  async job() {
    const migration = await MigrationModel.initModels()

    if (process.env.DO_DOWNLOAD_SERVER_DATA_UPDATE) {
      try {
        const data = await axios({
          method: 'GET',
          baseURL: process.env.MAIN_SERVER_URL,
          url: SERVER_UPDATE_DATA_URL,
          headers: {
            Authorization: process.env.MAIN_SERVER_ADMIN_TOKEN,
          },
        })
        const d = data?.data?.data?.models
        await migration.update(d)
      } catch (error) {
        Logger.error(error)
      }
    }

    if (process.env.DO_BACKUP) {
      const backupData = await migration.backup()
      if (backupData && backupData[0]) {
        try {
          await axios({
            method: 'POST',
            baseURL: process.env.MAIN_SERVER_URL,
            url: MIGRATE_DATA_URL,
            data: {
              data: backupData,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.MAIN_SERVER_ADMIN_TOKEN,
            },
          })
        } catch (error) {
          Logger.error(error)
        }
      }
    }

    if (process.env.DO_PUSHES) {
      try {
        const repoController = await RepoHooks.instance(null as any, {
          username: `${process.env.GIT_DB_PUSH_USERNAME}`,
          password: `${process.env.GIT_DB_PUSH_PASSWORD}`,
        })
        repoController.push({
          repo: EXPORT_DIRNAME,
          commitMessage: 'Committed from DailyDBFileGitPush at ' + new Date().toUTCString(),
        })
      } catch (error: any) {
        error.statusCode && error.statusCode != 200 && Logger.error(error)
      }
    }
  }
}

export default DoBackupORANDPush
