"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Payment_1 = __importDefault(require("../../../../controllers/lectureFlix/Payment"));
const PaymentModel_1 = require("../../../../models/lectureFlix/PaymentModel");
const RequestMethods_1 = require("../../../RequestMethods");
const PaymentRoutes = {
    tag: 'Payment',
    controller: Payment_1.default,
    baseUrl: '/payment',
    routes: [
        {
            path: '/payment/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Payment_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all payments',
            },
        },
        {
            path: '/payment/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get payment by id',
            },
        },
        {
            path: '/payment',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create payment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/payment',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update payment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/payment/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete payment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(PaymentModel_1.PaymentSchema),
    description: 'Operation on payment',
};
exports.default = PaymentRoutes;
