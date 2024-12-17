import { getObject } from '../../../common'
import { AuthenticationLevel } from '../../../configs/constants'
import User from '../../../controllers/User'
import { UserSchema } from '../../../models/UserModel'
import { IControllerRoute } from '../../interfaces/IControllerRoute'
import { RequestMethods } from '../../RequestMethods'

const UserRoutes: IControllerRoute = {
  baseUrl: '/user',
  routes: [
    {
      path: '/user/send-verification-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendVerificationMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send Verification Code to email',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },
    {
      path: '/user/send-forget-password-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendForgetPasswordMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send password reset email',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },
    {
      path: '/user/send-otp-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendOtpMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send OTP',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },
    {
      path: '/user/logged',
      controllerMemberFunctionIdentifier: User.prototype.logged,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Check if current user is still logged in',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: User.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/user-profile/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: User.prototype.profileAll,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user profile',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/user/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user by Id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-profile/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.getProfile,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get profile by user Id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user/detail/:uid([0-9]{10})?',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.getDetails,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user and there profile by user Id or without Id should fetch all',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user/login',
      controllerMemberFunctionIdentifier: User.prototype.login,
      method: RequestMethods.POST,
      metadata: {
        summary: 'User login',
      },
      validation: {
        body: {},
      },
    },
    {
      path: '/user/verify-mail',
      controllerMemberFunctionIdentifier: User.prototype.verifyEmail,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Verify user email',
      },
    },

    {
      path: '/user/verify-forget-password',
      controllerMemberFunctionIdentifier: User.prototype.verifyForgetPassword,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Verify forget password',
      },
    },

    {
      path: '/user/change-password',
      controllerMemberFunctionIdentifier: User.prototype.changePassword,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Change user password',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/user/change-pin',
      controllerMemberFunctionIdentifier: User.prototype.changePin,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Change user PIN',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/user/:email',
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create or update user by email',
      },
    },

    {
      path: '/user/:refID?',
      validation: {
        param: {
          refID: {},
        },
      },
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user with optional referral ID',
      },
    },
    {
      path: '/user',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user-profile',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user profile',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/user/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/user-profile/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.deleteProfile,
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user profile',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: getObject(UserSchema),
  tag: 'User',
  description: 'Operation on User model',
  controller: User,
}

export default UserRoutes
