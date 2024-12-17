import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import UserLog from '../../../../controllers/lectureFlix/UserLog'
import { UserLogSchema } from '../../../../models/lectureFlix/UserLogModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const UserLogRoutes: IControllerRoute = {
  tag: 'UserLog',
  controller: UserLog,
  baseUrl: '/user-log',
  routes: [
    {
      path: '/user-log/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: UserLog.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user logs',
      },
    },
    {
      path: '/user-log/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user log by id',
      },
    },
    {
      path: '/user-log',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user log',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-log',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user log',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-log/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user log',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(UserLogSchema),
  description: 'Operation on user log',
}

export default UserLogRoutes
