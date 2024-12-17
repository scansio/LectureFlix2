import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import SettingCategory from '../../../controllers/SettingCategory'
import { SettingCategorySchema } from '../../../models/SettingCategoryModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const SettingCategoryRoutes: IControllerRoute = {
  tag: 'SettingCategory',
  controller: SettingCategory,
  baseUrl: '/setting-category',
  routes: [
    {
      path: '/setting-category/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: SettingCategory.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all setting categories',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/setting-category/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get setting category by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/setting-category',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create setting category',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/setting-category',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update setting category',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/setting-category/:id([0-9a-fA-F]{24})',
      validation: {
        param: {
          id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete setting category',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(SettingCategorySchema),
  description: 'Operation on SettingCategory model',
}

export default SettingCategoryRoutes
