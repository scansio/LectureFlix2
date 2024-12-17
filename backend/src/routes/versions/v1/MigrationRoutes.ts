import { AuthenticationLevel } from '../../../configs/constants'
import Migration from '../../../controllers/Migration'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const MigrationRoutes: IControllerRoute = {
  tag: 'Migration',
  controller: Migration,
  baseUrl: '/migration',
  routes: [
    {
      path: '/migration/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Migration.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all migrations',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/migration/names',
      controllerMemberFunctionIdentifier: Migration.prototype.names,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get migration names',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/migration/backup',
      controllerMemberFunctionIdentifier: Migration.prototype.backup,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get migration backup',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/migration/:modelName',
      controllerMemberFunctionIdentifier: Migration.prototype.get,
      validation: {
        param: {
          modelName: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get a model data',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/migration',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/migration',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/migration',
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
  ],
  schema: {},
  description: 'Operation on data migration',
}

export default MigrationRoutes
