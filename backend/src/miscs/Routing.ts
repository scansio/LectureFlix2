/* eslint-disable @typescript-eslint/no-explicit-any */
import API from '../routes/API'
import { Router, NextFunction, Request, Response } from 'express'
import AllError from '../exceptions/base/AllError'
import { opendir } from 'fs/promises'
import path from 'path'
import Authenticate from './Authenticate'
import { BAD_AUTHENTICATION, SERVER_ERROR } from '../configs/statusCodeConstants'
import { getUser, sanitizeHTML } from '../common'
import IUser from '../types/IUser'
import { APIVersionStatus } from '../routes/APIVersionStatus'
import RequestValidation from './RequestValidation'
import { RequestMethodsMap } from '../routes/RequestMethods'
//import Logger from './Logger'

class Routing {
  public PUBLIC: number = 0
  public PRIVATE: number = 1
  public ALL: number = 2
  public app!: Router
  public res!: Response
  public req!: Request
  public next!: NextFunction

  constructor(app: Router) {
    this.app = app
  }

  private __getRoutes() {
    for (const api of API) {
      if (api.status === APIVersionStatus.ENABLED) {
        for (const controllerRoute of api.controllerRoutes) {
          const controller = controllerRoute.controller
          for (const route of controllerRoute.routes) {
            const endpoint = `/${api.info.version}${route.path.startsWith('/') ? '' : '/'}${route.path}`

            const createRoute = async (req: Request, res: Response, next: NextFunction) => {
              this.req = req
              this.res = res
              this.next = next
              try {
                const isPrivateMethod = route.requireAuthentication
                isPrivateMethod && (await this.authRoute(req))

                const childSender = new controller(req, res, next)

                childSender.setExecutingClassName(controller.name)
                childSender.setIsPrivateRoute(this, isPrivateMethod)

                const clientDataTemp = {
                  ...this.req.params,
                  ...this.req.body,
                }

                const clientData: {
                  [k: string]: any
                } = {}

                for (const clientDataKey in clientDataTemp) {
                  const clientDataValue = clientDataTemp[clientDataKey]
                  if (typeof clientDataValue === 'string') {
                    clientData[clientDataKey] = sanitizeHTML(clientDataValue)
                  } else {
                    clientData[clientDataKey] = clientDataValue
                  }
                }

                ;(childSender as any).clientData = clientData
                childSender.directRequest = true
                const pre = await childSender?.init()
                await childSender?.initConstruct()
                if (!pre) {
                  const error = new AllError('Initialization Failure')
                  error.statusCode = SERVER_ERROR
                  throw error
                }
                ;(
                  route.controllerMemberFunctionIdentifier ??
                  controller.prototype[RequestMethodsMap[route.method] as 'get']
                )
                  .call(childSender, clientData)
                  .catch((error: Error) => next(error))
              } catch (error) {
                next(error)
              }
            }

            new RequestValidation(route.validation).wrap(this.app, createRoute, route.method, endpoint)
          }
        }
      }
    }
  }

  public async authRoute(req: Request): Promise<IUser | null> {
    const authenticate = new Authenticate(req)
    if (!(await authenticate.verify())) {
      const error = new AllError('Authentication Error')
      error.status = BAD_AUTHENTICATION
      throw error
    } else {
      return getUser(this.req)
    }
  }

  sanitize() {
    //TODO Implement sanitization
  }

  publicFileRoutes() {
    this.app?.use('/v*/puf/*', async (req: Request, res: Response, next) => {
      const p = `${req.originalUrl}`
      const trimmed = p.split('/puf')[1]
      const abp = path.resolve(`${__dirname}/../../file_store/public${trimmed}`)
      try {
        await opendir(abp)
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      } catch (error) {
        res.sendFile(abp, (error) => {
          if (error) {
            const e = new AllError('Not Found')
            e.status = 404
            next(e)
          }
        })
      }
    })
  }

  privateFileRoutes() {
    this.app?.use('/v*/prf/*', async (req: Request, res: Response, next) => {
      this.req = req
      this.res = res
      this.next = next
      const user: IUser | null = await this.authRoute(req)
      if (!user) {
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      }
      const p = `${req.originalUrl}`
      const trimmed = p.split('/prf')[1]
      //let abp = path.resolve(__dirname, `../../file_store/private${trimmed}`);
      const abp_u = path.resolve(__dirname, `../../file_store/private/user/${user?._id}${trimmed}`)
      /* try {
        await opendir(abp);
      } catch (error) {
        if ((error as any).errno !== -2)
          res.sendFile(abp, (error) => {
            if (error) {
              let e = new AllError("Not Found");
              e.status = 404;
              next(e);
            }
          });
      } */
      try {
        await opendir(abp_u)
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      } catch (error) {
        res.sendFile(abp_u, (error) => {
          if (error) {
            const e = new AllError('Not Found')
            e.status = 404
            next(e)
          }
        })
      }
    })
  }

  allRoutes() {
    this.publicFileRoutes()
    this.privateFileRoutes()
    this.__getRoutes()
  }
}

export default Routing
