"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const UserLog_1 = __importDefault(require("../../../../controllers/lectureFlix/UserLog"));
const UserLogModel_1 = require("../../../../models/lectureFlix/UserLogModel");
const RequestMethods_1 = require("../../../RequestMethods");
const UserLogRoutes = {
    tag: 'UserLog',
    controller: UserLog_1.default,
    baseUrl: '/user-log',
    routes: [
        {
            path: '/user-log/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: UserLog_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all user logs',
            },
        },
        {
            path: '/user-log/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get user log by id',
            },
        },
        {
            path: '/user-log',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create user log',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-log',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update user log',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-log/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete user log',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(UserLogModel_1.UserLogSchema),
    description: 'Operation on user log',
};
exports.default = UserLogRoutes;
