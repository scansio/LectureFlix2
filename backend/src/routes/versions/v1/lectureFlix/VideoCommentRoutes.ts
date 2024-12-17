import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import VideoComment from '../../../../controllers/lectureFlix/VideoComment'
import { VideoCommentSchema } from '../../../../models/lectureFlix/VideoCommentModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const VideoCommentRoutes: IControllerRoute = {
  tag: 'VideoComment',
  controller: VideoComment,
  baseUrl: '/video-comment',
  routes: [
    {
      path: '/video-comment/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: VideoComment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all video comments',
      },
    },
    {
      path: '/video-comment/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get video comment by id',
      },
    },
    {
      path: '/video-comment',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create video comment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/video-comment',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update video comment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/video-comment/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete video comment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(VideoCommentSchema),
  description: 'Operation on video comment',
}

export default VideoCommentRoutes
