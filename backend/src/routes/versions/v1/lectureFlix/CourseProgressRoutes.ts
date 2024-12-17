import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import CourseProgress from '../../../../controllers/lectureFlix/CourseProgress'
import { CourseProgressSchema } from '../../../../models/lectureFlix/CourseProgressModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const CourseProgressRoutes: IControllerRoute = {
  tag: 'CourseProgress',
  controller: CourseProgress,
  baseUrl: '/course-progress',
  routes: [
    {
      path: '/course-progress/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: CourseProgress.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all course progresss',
      },
    },
    {
      path: '/course-progress/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get course progress by id',
      },
    },
    {
      path: '/course-progress',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create course progress',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course-progress',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update course progress',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course-progress/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete course progress',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(CourseProgressSchema),
  description: 'Operation on course progress',
}

export default CourseProgressRoutes
