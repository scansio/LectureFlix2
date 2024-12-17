import express, { Express, Router, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import * as https from 'https'
import * as http from 'http'
import * as fs from 'fs'
import { startServerTerminatorListener } from './serverTerminatorEvent'
import path from 'path'
import { getRequestUrl } from '../common'
import SharedConfig from '../libs/SharedConfig'
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware'
import serverConfig from './serverConfig'
import Logger from '../miscs/Logger'

export const serverCertificateOptions = (): https.ServerOptions => {
  const caDir = path.resolve(__dirname, '..', '..', 'ca')
  const certPath = path.resolve(caDir, 'certificate.crt')
  const caPath = path.resolve(caDir, 'ca_bundle.crt')
  const keyPath = path.resolve(caDir, 'private.key')

  const cert = fs.readFileSync(certPath)
  const ca = fs.readFileSync(caPath)
  const key = fs.readFileSync(keyPath)

  const options: https.ServerOptions = {
    cert,
    ca,
    key,
  }

  return options
}

export default function createSecureServer({
  app,
  router,
  serverName,
  scheme,
  port,
}: {
  app: Express
  router: Router
  serverName: string
  scheme: string
  port: string | number
}) {
  dotenv.config()
  const production = process.env.LOCAL_DEVELOPMENT !== 'yes'
  let protocol = 'http'
  const isSocketServer = scheme.includes('socket')
  if (isSocketServer) {
    protocol = production ? 'wss' : 'ws'
  } else {
    protocol = production ? 'https' : 'http'
  }
  const ip = process.env.SERVER_IP || '127.0.0.1'

  if (production) {
    //enforce https
    router.use((req, res, next) => {
      if (!req.secure) {
        const url = getRequestUrl(req).replace(isSocketServer ? 'ws:' : 'http:', isSocketServer ? 'wss' : 'https:')
        return res.redirect(url)
      }
      next()
    })
  }

  router.use(
    cors({
      methods: ['GET', 'POST', 'PATCH', 'DELETE'] /*origin: "http://localhost:3000"*/,
    }),
  )
  const proxifiers: { path: string; handler: RequestHandler<http.IncomingMessage> }[] = []

  for (const config of Object.values(serverConfig)) {
    if (config.scheme !== scheme) {
      const handler = createProxyMiddleware({
        target: `${protocol}://${ip}:${config.port}`, // The target server (CDN server)
        //changeOrigin: true, // Changes the origin of the host header to the target URL
        pathRewrite: { [`^/${scheme}`]: '' }, //pathRewrite: { [`^/${scheme}/${config.scheme}`]: '' }, // Rewrites the path to remove '/main/cdn'
        logger: Logger, // Logs for debugging; remove or set to 'error' in production
      })

      const path = `/${config.scheme}`

      const temp = {
        path,
        handler,
      }
      proxifiers.push(temp)
    }
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const pathname = req.url
    const proxifier = proxifiers.find((prox) => {
      return pathname.startsWith(prox.path)
    })
    if (proxifier) {
      proxifier?.handler(req, res, next)
    } else {
      next()
    }
  })

  router.use(express.json({ limit: '10mb' }))
  router.use(express.urlencoded({ extended: false }))
  router.use((req: Request, res: Response, next: NextFunction) => {
    SharedConfig.set('requestUrl', getRequestUrl(req))
    const pathname = req.path
    const proxifier = proxifiers.find((prox) => {
      return pathname.startsWith(prox.path)
    })
    if (proxifier) {
      proxifier?.handler(req, res, next)
    } else {
      next()
    }
  })

  app.use(`/${scheme}`, router)

  const options = serverCertificateOptions()
  const server = production ? https.createServer(options, app) : http.createServer(app)

  startServerTerminatorListener(serverName, () => {
    server.close()
    console.log('Server:', serverName, 'has been closed')
    process.exit()
  })
  addHtAccessRule({ scheme, port, protocol, ip })
  return server
}

export function addHtAccessRule({
  scheme,
  port,
  protocol,
  ip,
}: {
  scheme: string
  port: number | string
  protocol: string
  ip: string
}) {
  const REWRITE_RULE = path.resolve(__dirname, '..', '..', '.htaccess-rewrite-rule')
  const HTACCESS = path.resolve(__dirname, '..', '..', '.htaccess')
  try {
    const rule = fs.readFileSync(REWRITE_RULE, 'utf8')

    if (!rule) {
      console.log('Error reading rewrite rule: ' + REWRITE_RULE, 'No Rule found')
    } else {
      const newRule = rule
        .replace(/\[SCHEME\]/g, scheme)
        .replace(/\[PROTOCOL\]/g, protocol)
        .replace(/\[PORT\]/g, `${port}`)
        .replace(/\[IP\]/g, `${ip}`)
      try {
        const htaccess = fs.readFileSync(HTACCESS, 'utf8')
        if (!htaccess) {
          console.log('Error reading htaccess rule: ' + HTACCESS, 'No rule found in htaccess file')
        } else {
          const modifiedHtaccess = htaccess
            .split('\n')
            .map((currentRule) => (currentRule.includes(scheme) ? newRule : currentRule))
            .join('\n')
          try {
            fs.writeFileSync(HTACCESS, modifiedHtaccess)
          } catch (error) {
            console.log('Error writing htaccess rule: ' + HTACCESS, error)
          }
        }
      } catch (error) {
        console.log('Error reading htaccess rule: ' + HTACCESS, error)
      }
    }
  } catch (error) {
    console.log('Error reading rewrite rule: ' + REWRITE_RULE, error)
  }
}

export function onClose(server: http.Server, listener = async () => {}) {
  server.on('close', async () => await listener())
}
