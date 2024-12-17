"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const CourseVideo_1 = __importDefault(require("../../../../controllers/lectureFlix/CourseVideo"));
const CourseVideoModel_1 = require("../../../../models/lectureFlix/CourseVideoModel");
const RequestMethods_1 = require("../../../RequestMethods");
const CourseVideoRoutes = {
    tag: 'CourseVideo',
    controller: CourseVideo_1.default,
    baseUrl: '/course-video',
    routes: [
        {
            path: '/course-video/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: CourseVideo_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all course videos',
            },
        },
        {
            path: '/course-video/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get course video by id',
            },
        },
        {
            path: '/course-video',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create course video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course-video',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update course video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course-video/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete course video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(CourseVideoModel_1.CourseVideoSchema),
    description: 'Operation on course video',
};
exports.default = CourseVideoRoutes;
