import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import State from '../../../controllers/State'
import { StateSchema } from '../../../models/StateModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const StateRoutes: IControllerRoute = {
  baseUrl: '/state',
  routes: [
    {
      path: '/state/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: State.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all states',
      },
    },
    {
      path: '/state/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get state by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/state',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/state',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/state/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(StateSchema),
  tag: 'State',
  description: 'Operation on State model',
  controller: State,
}

export default StateRoutes
