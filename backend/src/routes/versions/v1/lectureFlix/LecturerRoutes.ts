import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Lecturer from '../../../../controllers/lectureFlix/Lecturer'
import { LecturerSchema } from '../../../../models/lectureFlix/LecturerModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const LecturerRoutes: IControllerRoute = {
  tag: 'Lecturer',
  controller: Lecturer,
  baseUrl: '/lecturer',
  routes: [
    {
      path: '/lecturer/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Lecturer.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all lecturers',
      },
    },
    {
      path: '/lecturer/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get lecturer by id',
      },
    },
    {
      path: '/lecturer',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create lecturer',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/lecturer',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update lecturer',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/lecturer/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete lecturer',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(LecturerSchema),
  description: 'Operation on lecturer',
}

export default LecturerRoutes
