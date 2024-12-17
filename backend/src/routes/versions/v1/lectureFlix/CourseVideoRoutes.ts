import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import CourseVideo from '../../../../controllers/lectureFlix/CourseVideo'
import { CourseVideoSchema } from '../../../../models/lectureFlix/CourseVideoModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const CourseVideoRoutes: IControllerRoute = {
  tag: 'CourseVideo',
  controller: CourseVideo,
  baseUrl: '/course-video',
  routes: [
    {
      path: '/course-video/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: CourseVideo.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all course videos',
      },
    },
    {
      path: '/course-video/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get course video by id',
      },
    },
    {
      path: '/course-video',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create course video',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course-video',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update course video',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/course-video/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete course video',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(CourseVideoSchema),
  description: 'Operation on course video',
}

export default CourseVideoRoutes
