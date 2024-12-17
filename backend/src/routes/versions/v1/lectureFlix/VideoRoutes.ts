import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Video from '../../../../controllers/lectureFlix/Video'
import { VideoSchema } from '../../../../models/lectureFlix/VideoModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const VideoRoutes: IControllerRoute = {
  tag: 'Video',
  controller: Video,
  baseUrl: '/video',
  routes: [
    {
      path: '/video/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Video.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all videos',
      },
    },
    {
      path: '/video/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get video by id',
      },
    },
    {
      path: '/video',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create video',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/video',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update video',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/video/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete video',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(VideoSchema),
  description: 'Operation on video',
}

export default VideoRoutes
