"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const AssessmentResults_1 = __importDefault(require("../../../../controllers/lectureFlix/AssessmentResults"));
const AssessmentResultsModel_1 = require("../../../../models/lectureFlix/AssessmentResultsModel");
const RequestMethods_1 = require("../../../RequestMethods");
const AssessmentResultsRoutes = {
    tag: 'AssessmentResults',
    controller: AssessmentResults_1.default,
    baseUrl: '/assessment-results',
    routes: [
        {
            path: '/assessment-results/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: AssessmentResults_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all assessment resultss',
            },
        },
        {
            path: '/assessment-results/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get assessment results by id',
            },
        },
        {
            path: '/assessment-results',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create assessment results',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/assessment-results',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update assessment results',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/assessment-results/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete assessment results',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(AssessmentResultsModel_1.AssessmentResultsSchema),
    description: 'Operation on assessment results',
};
exports.default = AssessmentResultsRoutes;
