import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Feedback from '../../../../controllers/lectureFlix/Feedback'
import { FeedbackSchema } from '../../../../models/lectureFlix/FeedbackModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const FeedbackRoutes: IControllerRoute = {
  tag: 'Feedback',
  controller: Feedback,
  baseUrl: '/feedback',
  routes: [
    {
      path: '/feedback/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Feedback.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all feedbacks',
      },
    },
    {
      path: '/feedback/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get feedback by id',
      },
    },
    {
      path: '/feedback',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create feedback',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/feedback',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update feedback',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/feedback/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete feedback',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(FeedbackSchema),
  description: 'Operation on feedback',
}

export default FeedbackRoutes
