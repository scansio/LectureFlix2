"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const UserSetting_1 = __importDefault(require("../../../controllers/UserSetting"));
const UserSettingModel_1 = require("../../../models/UserSettingModel");
const RequestMethods_1 = require("../../RequestMethods");
const UserSettingRoutes = {
    baseUrl: '/user-setting',
    routes: [
        {
            path: '/user-setting/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: UserSetting_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all user setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/user-setting/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get user-setting by id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-setting/reset/:uid([0-9]{10})?',
            controllerMemberFunctionIdentifier: UserSetting_1.default.prototype.reset,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Reset user setting',
            },
            validation: {
                param: {
                    uid: {
                        notEmpty: {},
                    },
                },
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-setting/:name/:uid([0-9]{10})?',
            validation: {
                param: {
                    uid: {
                        notEmpty: {},
                        isLength: { min: 10, max: 10 },
                    },
                    name: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get setting user setting by name',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-setting',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create user setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-setting',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update user setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-setting/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete user setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(UserSettingModel_1.UserSettingSchema),
    tag: 'UserSetting',
    description: 'Operation on UserSetting model',
    controller: UserSetting_1.default,
};
exports.default = UserSettingRoutes;
