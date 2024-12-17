"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Subscription_1 = __importDefault(require("../../../../controllers/lectureFlix/Subscription"));
const SubscriptionModel_1 = require("../../../../models/lectureFlix/SubscriptionModel");
const RequestMethods_1 = require("../../../RequestMethods");
const SubscriptionRoutes = {
    tag: 'Subscription',
    controller: Subscription_1.default,
    baseUrl: '/subscription',
    routes: [
        {
            path: '/subscription/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Subscription_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all subscriptions',
            },
        },
        {
            path: '/subscription/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get subscription by id',
            },
        },
        {
            path: '/subscription',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create subscription',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/subscription',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update subscription',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/subscription/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete subscription',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(SubscriptionModel_1.SubscriptionSchema),
    description: 'Operation on subscription',
};
exports.default = SubscriptionRoutes;
