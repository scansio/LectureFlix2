"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const User_1 = __importDefault(require("../../../controllers/User"));
const UserModel_1 = require("../../../models/UserModel");
const RequestMethods_1 = require("../../RequestMethods");
const UserRoutes = {
    baseUrl: '/user',
    routes: [
        {
            path: '/user/send-verification-mail/:email',
            controllerMemberFunctionIdentifier: User_1.default.prototype.sendVerificationMail,
            method: RequestMethods_1.RequestMethods.GET,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.sendForgetPasswordMail,
            method: RequestMethods_1.RequestMethods.GET,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.sendOtpMail,
            method: RequestMethods_1.RequestMethods.GET,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.logged,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Check if current user is still logged in',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: User_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all user',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/user-profile/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: User_1.default.prototype.profileAll,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all user profile',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
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
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get user by Id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.getProfile,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get profile by user Id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.getDetails,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get user and there profile by user Id or without Id should fetch all',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user/login',
            controllerMemberFunctionIdentifier: User_1.default.prototype.login,
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'User login',
            },
            validation: {
                body: {},
            },
        },
        {
            path: '/user/verify-mail',
            controllerMemberFunctionIdentifier: User_1.default.prototype.verifyEmail,
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Verify user email',
            },
        },
        {
            path: '/user/verify-forget-password',
            controllerMemberFunctionIdentifier: User_1.default.prototype.verifyForgetPassword,
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Verify forget password',
            },
        },
        {
            path: '/user/change-password',
            controllerMemberFunctionIdentifier: User_1.default.prototype.changePassword,
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Change user password',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user/change-pin',
            controllerMemberFunctionIdentifier: User_1.default.prototype.changePin,
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Change user PIN',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
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
            method: RequestMethods_1.RequestMethods.POST,
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
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create user with optional referral ID',
            },
        },
        {
            path: '/user',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update user',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-profile',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update user profile',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
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
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete user',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
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
            controllerMemberFunctionIdentifier: User_1.default.prototype.deleteProfile,
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete user profile',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(UserModel_1.UserSchema),
    tag: 'User',
    description: 'Operation on User model',
    controller: User_1.default,
};
exports.default = UserRoutes;
