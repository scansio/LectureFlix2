"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const Countrie_1 = __importDefault(require("../../../controllers/Countrie"));
const CountrieModel_1 = require("../../../models/CountrieModel");
const RequestMethods_1 = require("../../RequestMethods");
const CountrieRoutes = {
    tag: 'Countrie',
    controller: Countrie_1.default,
    baseUrl: '/countrie',
    routes: [
        {
            path: '/countrie/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Countrie_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all countries',
            },
        },
        {
            path: '/countrie/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get countrie by id',
            },
        },
        {
            path: '/countrie',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create country',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/countrie',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update country',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/countrie/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete country',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(CountrieModel_1.CountrieSchema),
    description: 'Countries endpoints',
};
exports.default = CountrieRoutes;
