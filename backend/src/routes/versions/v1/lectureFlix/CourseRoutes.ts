import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Course from '../../../../controllers/lectureFlix/Course'
import { CourseSchema } from '../../../../models/lectureFlix/CourseModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const CourseRoutes: IControllerRoute = {
  tag: 'Course',
  controller: Course,
  baseUrl: '/course',
  routes: [
    {
      path: '/course/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Course.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all courses',
      },
    },
    {
      path: '/course/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get course by id',
      },
    },
    {
      path: '/course',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create course',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update course',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete course',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(CourseSchema),
  description: 'Operation on course',
}

export default CourseRoutes
