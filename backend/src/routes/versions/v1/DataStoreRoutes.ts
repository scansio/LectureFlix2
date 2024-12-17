import { AuthenticationLevel } from '../../../configs/constants'
import DataStore from '../../../controllers/DataStore'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const DataStoreRoutes: IControllerRoute = {
  tag: 'DataStore',
  controller: DataStore,
  baseUrl: '/data-store',
  routes: [
    {
      path: '/data-store/count/:store',
      controllerMemberFunctionIdentifier: DataStore.prototype.count,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get count of data store',
      },
      validation: {
        param: {
          store: {
            notEmpty: {},
          },
        },
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/data-store/sum/:field/:store',
      controllerMemberFunctionIdentifier: DataStore.prototype.sum,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get sum of a field in data store',
      },
      validation: {
        param: {
          field: {
            notEmpty: {},
          },
          store: {
            notEmpty: {},
          },
        },
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: {},
  description: 'Operation on Data store model',
}

export default DataStoreRoutes
