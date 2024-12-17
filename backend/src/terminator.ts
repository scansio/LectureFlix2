/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import AllError from './exceptions/base/AllError'
import { BAD_REQUEST, SERVER_ERROR } from './configs/statusCodeConstants'
import Logger from './miscs/Logger'
import SharedConfig from './libs/SharedConfig'
import IAny from './types/IAny'
import IConnectInfo from './types/IConnectInfo'
import IResStruct from './types/IResStruct'

/**
 * This is express middleware that serves as the central place
 * where response are being sent back to client.
 *
 * @see {@link IResStruct}
 *
 * @param error Error that triggered this middleware
 * @param req Request
 * @param res Response
 * @param _next Next middleware function
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const terminator = (error: AllError, req: Request, res: Response, next: NextFunction) => {
  if (error.sendSignal) {
    res.status(error.sendSignal.connection.statusCode).json(error.sendSignal)
  } else {
    const connection: IConnectInfo = {
      endpoint: SharedConfig.get('requestUrl'),
      statusCode: error?.status || BAD_REQUEST,
    } as any
    ;((req as unknown as IAny | null)?.user as any)?.uid &&
      (connection.uid = ((req as unknown as IAny).user as any)?.uid)
    error.errorCode && (connection.errorCode = error.errorCode)
    const { status, message } = error.data || {
      status: false,
      message: error?.status == SERVER_ERROR ? 'Internal Error' : error.message,
    }
    connection.status = status
    connection.message = message
    const d: IResStruct = {
      connection: connection as IConnectInfo,
      data: {},
    }
    if (error.name === 'ValidationError') {
      d.connection.message = ''
      for (const path in error.errors) {
        if (Object.prototype.hasOwnProperty.call(error.errors, path)) {
          const errorT = error.errors[path]
          d.connection.message += errorT.message + '\n'
        }
      }
    } else if (error.name === 'MongoServerError' && error.code == 11000) {
      d.connection.message = ''
      if (error.errors) {
        for (const path in error.errors) {
          if (Object.prototype.hasOwnProperty.call(error.errors, path)) {
            const errorT = error.errors[path]
            const [p, value] = Object.entries((errorT as IAny).keyValue as any)[0]
            d.connection.message += `${p}: ${value} already exist\n`
          }
        }
      } else {
        const [path, value] = Object.entries((error as IAny).keyValue as any)[0]
        d.connection.message += `${path}: ${value} already exist\n`
      }
    } else if (error.name === 'MongooseServerSelectionError') {
      d.connection.message = `Server connection error`
      d.connection.statusCode = SERVER_ERROR
    } else {
      Logger.log('error', { error, d })
    }
    res.status(connection.statusCode as number).json(d)
  }
}

export default terminator
