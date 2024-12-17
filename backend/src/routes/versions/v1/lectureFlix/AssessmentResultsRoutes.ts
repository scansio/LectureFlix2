import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import AssessmentResults from '../../../../controllers/lectureFlix/AssessmentResults'
import { AssessmentResultsSchema } from '../../../../models/lectureFlix/AssessmentResultsModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const AssessmentResultsRoutes: IControllerRoute = {
  tag: 'AssessmentResults',
  controller: AssessmentResults,
  baseUrl: '/assessment-results',
  routes: [
    {
      path: '/assessment-results/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: AssessmentResults.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all assessment resultss',
      },
    },
    {
      path: '/assessment-results/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get assessment results by id',
      },
    },
    {
      path: '/assessment-results',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create assessment results',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/assessment-results',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update assessment results',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/assessment-results/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete assessment results',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(AssessmentResultsSchema),
  description: 'Operation on assessment results',
}

export default AssessmentResultsRoutes
