import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import Setting from '../../../controllers/Setting'
import { SettingSchema } from '../../../models/SettingModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const SettingRoutes: IControllerRoute = {
  baseUrl: '/setting',
  routes: [
    {
      path: '/setting/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Setting.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all settings',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/setting/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get setting by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/setting',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create setting',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/setting',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update setting',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/setting/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete setting',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
  ],
  schema: getObject(SettingSchema),
  tag: 'Setting',
  description: 'Operation on Setting model',
  controller: Setting,
}

export default SettingRoutes
