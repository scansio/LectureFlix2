/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv'
import express, { Express, Router } from 'express'
import mongoose from 'mongoose'
import Routing from '../miscs/Routing'
import terminator from '../terminator'
import createSecureServer, { onClose } from './createSecureServer'
import serverConfig from './serverConfig'
;(async () => {
  const app: Express = express()
  dotenv.config()
  const MAIN_SERVER_PORT: number = serverConfig.MAIN_SERVER.port
  const MAIN_SERVER_SCHEME = serverConfig.MAIN_SERVER.scheme
  const router = Router()
  const serverName = 'MainServer'
  const server = createSecureServer({
    app,
    serverName,
    router,
    scheme: MAIN_SERVER_SCHEME,
    port: MAIN_SERVER_PORT,
  })

  const dbConnectionString: string = (
    process.env.ENVIRONMENT === 'production' ? process.env.MONGO_URI_PASS : process.env.MONGO_URI_PASS_LOCAL
  ) as string

  const routing = new Routing(router)
  routing.allRoutes()

  app.use(terminator)

  mongoose.set('strictQuery', true)
  //mongoose.set('debug', true)

  try {
    const mongodb = await mongoose.connect(dbConnectionString)
    server.listen(MAIN_SERVER_PORT, '0.0.0.0', () => {
      console.log(`${serverName} running on port ${MAIN_SERVER_PORT}`)
    })
    onClose(server, mongodb.disconnect)
  } catch (error) {
    console.log(error)
    process.exit()
  }
  return app
})()
