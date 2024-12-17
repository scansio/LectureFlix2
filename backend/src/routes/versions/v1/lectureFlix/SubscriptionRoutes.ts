import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Subscription from '../../../../controllers/lectureFlix/Subscription'
import { SubscriptionSchema } from '../../../../models/lectureFlix/SubscriptionModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const SubscriptionRoutes: IControllerRoute = {
  tag: 'Subscription',
  controller: Subscription,
  baseUrl: '/subscription',
  routes: [
    {
      path: '/subscription/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Subscription.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all subscriptions',
      },
    },
    {
      path: '/subscription/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get subscription by id',
      },
    },
    {
      path: '/subscription',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create subscription',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/subscription',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update subscription',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/subscription/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete subscription',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(SubscriptionSchema),
  description: 'Operation on subscription',
}

export default SubscriptionRoutes
