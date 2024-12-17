import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import UserSetting from '../../../controllers/UserSetting'
import { UserSettingSchema } from '../../../models/UserSettingModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const UserSettingRoutes: IControllerRoute = {
  baseUrl: '/user-setting',
  routes: [
    {
      path: '/user-setting/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: UserSetting.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user setting',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/user-setting/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user-setting by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-setting/reset/:uid([0-9]{10})?',
      controllerMemberFunctionIdentifier: UserSetting.prototype.reset,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Reset user setting',
      },
      validation: {
        param: {
          uid: {
            notEmpty: {},
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-setting/:name/:uid([0-9]{10})?',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
          name: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get setting user setting by name',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-setting',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user setting',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-setting',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user setting',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-setting/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user setting',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(UserSettingSchema),
  tag: 'UserSetting',
  description: 'Operation on UserSetting model',
  controller: UserSetting,
}

export default UserSettingRoutes
