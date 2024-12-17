import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Learner from '../../../../controllers/lectureFlix/Learner'
import { LearnerSchema } from '../../../../models/lectureFlix/LearnerModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const LearnerRoutes: IControllerRoute = {
  tag: 'Learner',
  controller: Learner,
  baseUrl: '/learner',
  routes: [
    {
      path: '/learner/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Learner.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all learners',
      },
    },
    {
      path: '/learner/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get learner by id',
      },
    },
    {
      path: '/learner',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create learner',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/learner',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update learner',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/learner/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete learner',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(LearnerSchema),
  description: 'Operation on learner',
}

export default LearnerRoutes
