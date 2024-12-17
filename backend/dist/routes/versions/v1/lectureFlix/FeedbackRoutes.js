"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Feedback_1 = __importDefault(require("../../../../controllers/lectureFlix/Feedback"));
const FeedbackModel_1 = require("../../../../models/lectureFlix/FeedbackModel");
const RequestMethods_1 = require("../../../RequestMethods");
const FeedbackRoutes = {
    tag: 'Feedback',
    controller: Feedback_1.default,
    baseUrl: '/feedback',
    routes: [
        {
            path: '/feedback/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Feedback_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all feedbacks',
            },
        },
        {
            path: '/feedback/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get feedback by id',
            },
        },
        {
            path: '/feedback',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create feedback',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/feedback',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update feedback',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/feedback/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete feedback',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(FeedbackModel_1.FeedbackSchema),
    description: 'Operation on feedback',
};
exports.default = FeedbackRoutes;
