import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Payment from '../../../../controllers/lectureFlix/Payment'
import { PaymentSchema } from '../../../../models/lectureFlix/PaymentModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const PaymentRoutes: IControllerRoute = {
  tag: 'Payment',
  controller: Payment,
  baseUrl: '/payment',
  routes: [
    {
      path: '/payment/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Payment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all payments',
      },
    },
    {
      path: '/payment/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get payment by id',
      },
    },
    {
      path: '/payment',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create payment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/payment',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update payment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/payment/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete payment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(PaymentSchema),
  description: 'Operation on payment',
}

export default PaymentRoutes
