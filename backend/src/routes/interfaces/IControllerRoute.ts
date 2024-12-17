import BaseController from '../../controllers/base/BaseController'
import { IRoute } from './IRoute'

export interface IControllerRoute {
  schema: object
  routes: IRoute[]
  tag: string
  baseUrl: string
  description: string
  externalDocs?: {
    description: string
    url: string
  }
  controller: typeof BaseController
}
