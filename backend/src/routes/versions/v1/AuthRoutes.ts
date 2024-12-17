import { getObject } from '../../../common'
import User from '../../../controllers/User'
import { UserSchema } from '../../../models/UserModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const AuthRoutes: IControllerRoute = {
  tag: 'Authentication',
  baseUrl: '/auth',
  controller: User,
  routes: [
    {
      path: '/auth/google',
      controllerMemberFunctionIdentifier: User.prototype.googleOauth2,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Google Oauth2 generate authentication link',
      },
    },
    {
      path: '/auth/verify',
      controllerMemberFunctionIdentifier: User.prototype.googleOauth2,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Google Oauth2 verify authentication ',
      },
    },
  ],
  schema: getObject(UserSchema),
  description: 'Google sign in',
}

export default AuthRoutes
