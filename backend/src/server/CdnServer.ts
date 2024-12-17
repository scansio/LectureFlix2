import express, { Router } from 'express'
import * as path from 'path'
import dotenv from 'dotenv'
import compression from 'compression'
import createSecureServer from './createSecureServer'
import Logger from '../miscs/Logger'
import serverConfig from './serverConfig'
;(async () => {
  dotenv.config()

  const app = express()
  
  const router = Router()
  const serverName = 'CdnServer'
  const CDN_PORT = serverConfig.CDN_SERVER.port
  const CDN_SCHEME = serverConfig.CDN_SERVER.scheme

  // Enable compression for all responses
  app.use(compression())

  const server = createSecureServer({
    app,
    router,
    serverName,
    scheme: CDN_SCHEME,
    port: CDN_PORT,
  })

  const cdnDir = path.join(__dirname, '..', '..', 'cdn')

  router.use(
    express.static(cdnDir, {
      maxAge: '1d',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=86400')
        //res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      },
    }),
  )

  process.on('uncaughtException', (err) => {
    Logger.log('error', err)
  })

  process.on('unhandledRejection', (reason) => {
    Logger.log('error', reason)
  })

  server.listen(CDN_PORT, () => {
    console.log(`${serverName} running on port ${CDN_PORT}`)
  })

  return app
})()
