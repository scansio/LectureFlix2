import { getObject } from '../../../../common'
import { AuthenticationLevel } from '../../../../configs/constants'
import Certificate from '../../../../controllers/lectureFlix/Certificate'
import { CertificateSchema } from '../../../../models/lectureFlix/CertificateModel'
import { IControllerRoute } from '../../../interfaces/IControllerRoute'
import { RequestMethods } from '../../../RequestMethods'

const CertificateRoutes: IControllerRoute = {
  tag: 'Certificate',
  controller: Certificate,
  baseUrl: '/certificate',
  routes: [
    {
      path: '/certificate/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Certificate.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all certificates',
      },
    },
    {
      path: '/certificate/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get certificate by id',
      },
    },
    {
      path: '/certificate',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create certificate',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/certificate',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update certificate',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/certificate/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete certificate',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(CertificateSchema),
  description: 'Operation on certificate',
}

export default CertificateRoutes
