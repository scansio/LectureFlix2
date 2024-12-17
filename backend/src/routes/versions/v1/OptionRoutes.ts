import { Schema } from 'mongoose'
import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import Option from '../../../controllers/Option'
import { OptionSchema } from '../../../models/OptionModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const OptionRoutes: IControllerRoute = {
  tag: 'Option',
  controller: Option,
  baseUrl: '/option',
  routes: [
    {
      path: '/option/publics',

      controllerMemberFunctionIdentifier: Option.prototype.publics,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get public options',
      },
    },
    {
      path: '/option/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Option.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all options',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/option/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get option by id',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/option',

      method: RequestMethods.POST,
      metadata: {
        summary: 'Create option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/option',

      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/option/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },

      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
  ],
  schema: getObject(OptionSchema as Schema),
  description: 'Operation on Option model',
}

export default OptionRoutes
