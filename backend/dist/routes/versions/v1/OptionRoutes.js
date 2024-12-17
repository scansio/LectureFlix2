"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const Option_1 = __importDefault(require("../../../controllers/Option"));
const OptionModel_1 = require("../../../models/OptionModel");
const RequestMethods_1 = require("../../RequestMethods");
const OptionRoutes = {
    tag: 'Option',
    controller: Option_1.default,
    baseUrl: '/option',
    routes: [
        {
            path: '/option/publics',
            controllerMemberFunctionIdentifier: Option_1.default.prototype.publics,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get public options',
            },
        },
        {
            path: '/option/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Option_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all options',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/option/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get option by id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/option',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create option',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/option',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update option',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/option/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete option',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
    ],
    schema: (0, common_1.getObject)(OptionModel_1.OptionSchema),
    description: 'Operation on Option model',
};
exports.default = OptionRoutes;
