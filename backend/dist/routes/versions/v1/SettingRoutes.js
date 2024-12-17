"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const Setting_1 = __importDefault(require("../../../controllers/Setting"));
const SettingModel_1 = require("../../../models/SettingModel");
const RequestMethods_1 = require("../../RequestMethods");
const SettingRoutes = {
    baseUrl: '/setting',
    routes: [
        {
            path: '/setting/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Setting_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all settings',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/setting/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get setting by id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/setting',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/setting',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
        {
            path: '/setting/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete setting',
            },
            requireAuthentication: constants_1.AuthenticationLevel.DEVELOPER,
        },
    ],
    schema: (0, common_1.getObject)(SettingModel_1.SettingSchema),
    tag: 'Setting',
    description: 'Operation on Setting model',
    controller: Setting_1.default,
};
exports.default = SettingRoutes;
