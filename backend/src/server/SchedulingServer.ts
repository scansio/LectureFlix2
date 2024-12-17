import dotenv from 'dotenv'
import express, { Router } from 'express'
import mongoose from 'mongoose'
import Logger from '../miscs/Logger'
import CronDefinition from '../cronjobs/config/CronDefinition'
import createSecureServer, { onClose } from './createSecureServer'
import serverConfig from './serverConfig'
;(async () => {
  const app = express()
  dotenv.config()
  const serverName = 'SchedulingServer'
  const SCHEDULING_SERVER_PORT = serverConfig.SCHEDULING_SERVER.port
  const SCHEDULING_SERVER_SCHEME = serverConfig.SCHEDULING_SERVER.scheme
  const router = Router()
  const server = createSecureServer({
    app,
    serverName,
    router,
    scheme: SCHEDULING_SERVER_SCHEME,
    port: SCHEDULING_SERVER_PORT,
  })

  const dbConnectionString: string = (
    process.env.ENVIRONMENT === 'production' ? process.env.MONGO_URI_PASS : process.env.MONGO_URI_PASS_LOCAL
  ) as string

  mongoose.set('strictQuery', true)

  try {
    const mongodb = await mongoose.connect(dbConnectionString)
    server.listen(SCHEDULING_SERVER_PORT, () => {
      console.log(`${serverName} running on port ${SCHEDULING_SERVER_PORT}`)

      new CronDefinition().start().catch((error) => {
        Logger.log('error', error)
        //console.log(error, '\n\n')
      })
    })
    onClose(server, mongodb.disconnect)
  } catch (error) {
    Logger.log('error', error)
    //console.log(error, '\n\n')
    process.exit()
  }
  return app
})()
