import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import UserActivity from '../../../../controllers/lectureFlix/UserActivity'
import { UserActivitySchema } from '../../../../models/lectureFlix/UserActivityModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const UserActivityRoutes: IControllerRoute = {
  tag: 'UserActivity',
  controller: UserActivity,
  baseUrl: '/user-activity',
  routes: [
    {
      path: '/user-activity/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: UserActivity.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user activitys',
      },
    },
    {
      path: '/user-activity/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user activity by id',
      },
    },
    {
      path: '/user-activity',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user activity',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-activity',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user activity',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-activity/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user activity',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(UserActivitySchema),
  description: 'Operation on user activity',
}

export default UserActivityRoutes
