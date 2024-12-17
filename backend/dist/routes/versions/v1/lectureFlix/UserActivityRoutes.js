"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const UserActivity_1 = __importDefault(require("../../../../controllers/lectureFlix/UserActivity"));
const UserActivityModel_1 = require("../../../../models/lectureFlix/UserActivityModel");
const RequestMethods_1 = require("../../../RequestMethods");
const UserActivityRoutes = {
    tag: 'UserActivity',
    controller: UserActivity_1.default,
    baseUrl: '/user-activity',
    routes: [
        {
            path: '/user-activity/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: UserActivity_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all user activitys',
            },
        },
        {
            path: '/user-activity/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get user activity by id',
            },
        },
        {
            path: '/user-activity',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create user activity',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-activity',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update user activity',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/user-activity/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete user activity',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(UserActivityModel_1.UserActivitySchema),
    description: 'Operation on user activity',
};
exports.default = UserActivityRoutes;
