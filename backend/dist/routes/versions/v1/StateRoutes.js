"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const State_1 = __importDefault(require("../../../controllers/State"));
const StateModel_1 = require("../../../models/StateModel");
const RequestMethods_1 = require("../../RequestMethods");
const StateRoutes = {
    baseUrl: '/state',
    routes: [
        {
            path: '/state/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: State_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all states',
            },
        },
        {
            path: '/state/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get state by id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/state',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create state',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/state',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update state',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/state/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete state',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(StateModel_1.StateSchema),
    tag: 'State',
    description: 'Operation on State model',
    controller: State_1.default,
};
exports.default = StateRoutes;
