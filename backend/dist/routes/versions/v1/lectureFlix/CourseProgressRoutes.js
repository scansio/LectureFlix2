"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const CourseProgress_1 = __importDefault(require("../../../../controllers/lectureFlix/CourseProgress"));
const CourseProgressModel_1 = require("../../../../models/lectureFlix/CourseProgressModel");
const RequestMethods_1 = require("../../../RequestMethods");
const CourseProgressRoutes = {
    tag: 'CourseProgress',
    controller: CourseProgress_1.default,
    baseUrl: '/course-progress',
    routes: [
        {
            path: '/course-progress/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: CourseProgress_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all course progresss',
            },
        },
        {
            path: '/course-progress/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get course progress by id',
            },
        },
        {
            path: '/course-progress',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create course progress',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course-progress',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update course progress',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course-progress/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete course progress',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(CourseProgressModel_1.CourseProgressSchema),
    description: 'Operation on course progress',
};
exports.default = CourseProgressRoutes;
