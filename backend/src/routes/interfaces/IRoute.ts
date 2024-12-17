/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestMethods } from '../RequestMethods'
import { IPathMethodMetadata } from './IPathMethodMetadata'
import { AuthenticationLevel } from '../../configs/constants'
import IValidation from './IValidation'

export interface IRoute {
  path: string
  controllerMemberFunctionIdentifier?: (data?: any) => Promise<void>
  method: RequestMethods
  metadata: IPathMethodMetadata
  validation?: IValidation
  requireAuthentication?: AuthenticationLevel
}
