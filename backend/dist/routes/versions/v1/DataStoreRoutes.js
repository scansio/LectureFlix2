"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../configs/constants");
const DataStore_1 = __importDefault(require("../../../controllers/DataStore"));
const RequestMethods_1 = require("../../RequestMethods");
const DataStoreRoutes = {
    tag: 'DataStore',
    controller: DataStore_1.default,
    baseUrl: '/data-store',
    routes: [
        {
            path: '/data-store/count/:store',
            controllerMemberFunctionIdentifier: DataStore_1.default.prototype.count,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get count of data store',
            },
            validation: {
                param: {
                    store: {
                        notEmpty: {},
                    },
                },
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/data-store/sum/:field/:store',
            controllerMemberFunctionIdentifier: DataStore_1.default.prototype.sum,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get sum of a field in data store',
            },
            validation: {
                param: {
                    field: {
                        notEmpty: {},
                    },
                    store: {
                        notEmpty: {},
                    },
                },
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: {},
    description: 'Operation on Data store model',
};
exports.default = DataStoreRoutes;
