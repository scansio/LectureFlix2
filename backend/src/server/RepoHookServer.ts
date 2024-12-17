import express, { Express, Router } from 'express'
import Logger from '../miscs/Logger'
import RepoHooks from '../RepoHooks'
import dotenv from 'dotenv'
import createSecureServer from './createSecureServer'
import serverConfig from './serverConfig'
;(async () => {
  dotenv.config()
  const app: Express = express()
  const serverName = 'RepoHookServer'
  const REPO_HOOK_SERVER_PORT = serverConfig.REPO_HOOK_SERVER.port
  const REPO_HOOK_SERVER_SCHEME = serverConfig.REPO_HOOK_SERVER.scheme
  const router = Router()
  const server = createSecureServer({
    app,
    serverName,
    router,
    scheme: REPO_HOOK_SERVER_SCHEME,
    port: REPO_HOOK_SERVER_PORT,
  })

  await RepoHooks.instance(router)

  try {
    server.listen(REPO_HOOK_SERVER_PORT, () => {
      console.log(`${serverName} running on port ${REPO_HOOK_SERVER_PORT}`)
    })
  } catch (error) {
    console.log(error)
    Logger.log('error', error)
  }
  return app
})()
