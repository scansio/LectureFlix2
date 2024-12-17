"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Learner_1 = __importDefault(require("../../../../controllers/lectureFlix/Learner"));
const LearnerModel_1 = require("../../../../models/lectureFlix/LearnerModel");
const RequestMethods_1 = require("../../../RequestMethods");
const LearnerRoutes = {
    tag: 'Learner',
    controller: Learner_1.default,
    baseUrl: '/learner',
    routes: [
        {
            path: '/learner/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Learner_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all learners',
            },
        },
        {
            path: '/learner/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get learner by id',
            },
        },
        {
            path: '/learner',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create learner',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/learner',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update learner',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/learner/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete learner',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(LearnerModel_1.LearnerSchema),
    description: 'Operation on learner',
};
exports.default = LearnerRoutes;
