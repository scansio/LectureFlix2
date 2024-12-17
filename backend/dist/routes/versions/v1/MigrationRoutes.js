"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../configs/constants");
const Migration_1 = __importDefault(require("../../../controllers/Migration"));
const RequestMethods_1 = require("../../RequestMethods");
const MigrationRoutes = {
    tag: 'Migration',
    controller: Migration_1.default,
    baseUrl: '/migration',
    routes: [
        {
            path: '/migration/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Migration_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all migrations',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/migration/names',
            controllerMemberFunctionIdentifier: Migration_1.default.prototype.names,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get migration names',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/migration/backup',
            controllerMemberFunctionIdentifier: Migration_1.default.prototype.backup,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get migration backup',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/migration/:modelName',
            controllerMemberFunctionIdentifier: Migration_1.default.prototype.get,
            validation: {
                param: {
                    modelName: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get a model data',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/migration',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create migration',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/migration',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update migration',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/migration',
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete migration',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
    ],
    schema: {},
    description: 'Operation on data migration',
};
exports.default = MigrationRoutes;
