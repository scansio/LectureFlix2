import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import Countrie from '../../../controllers/Countrie'
import { CountrieSchema } from '../../../models/CountrieModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const CountrieRoutes: IControllerRoute = {
  tag: 'Countrie',
  controller: Countrie,
  baseUrl: '/countrie',
  routes: [
    {
      path: '/countrie/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Countrie.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all countries',
      },
    },
    {
      path: '/countrie/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get countrie by id',
      },
    },
    {
      path: '/countrie',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/countrie',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/countrie/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(CountrieSchema),
  description: 'Countries endpoints',
}

export default CountrieRoutes
