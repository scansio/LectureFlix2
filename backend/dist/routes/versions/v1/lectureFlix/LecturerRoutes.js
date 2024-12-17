"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Lecturer_1 = __importDefault(require("../../../../controllers/lectureFlix/Lecturer"));
const LecturerModel_1 = require("../../../../models/lectureFlix/LecturerModel");
const RequestMethods_1 = require("../../../RequestMethods");
const LecturerRoutes = {
    tag: 'Lecturer',
    controller: Lecturer_1.default,
    baseUrl: '/lecturer',
    routes: [
        {
            path: '/lecturer/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Lecturer_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all lecturers',
            },
        },
        {
            path: '/lecturer/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get lecturer by id',
            },
        },
        {
            path: '/lecturer',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create lecturer',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/lecturer',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update lecturer',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/lecturer/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete lecturer',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(LecturerModel_1.LecturerSchema),
    description: 'Operation on lecturer',
};
exports.default = LecturerRoutes;
