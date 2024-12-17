"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Course_1 = __importDefault(require("../../../../controllers/lectureFlix/Course"));
const CourseModel_1 = require("../../../../models/lectureFlix/CourseModel");
const RequestMethods_1 = require("../../../RequestMethods");
const CourseRoutes = {
    tag: 'Course',
    controller: Course_1.default,
    baseUrl: '/course',
    routes: [
        {
            path: '/course/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Course_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all courses',
            },
        },
        {
            path: '/course/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get course by id',
            },
        },
        {
            path: '/course',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create course',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update course',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/course/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete course',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(CourseModel_1.CourseSchema),
    description: 'Operation on course',
};
exports.default = CourseRoutes;
