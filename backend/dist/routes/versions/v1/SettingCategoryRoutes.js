"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const constants_1 = require("../../../configs/constants");
const SettingCategory_1 = __importDefault(require("../../../controllers/SettingCategory"));
const SettingCategoryModel_1 = require("../../../models/SettingCategoryModel");
const RequestMethods_1 = require("../../RequestMethods");
const SettingCategoryRoutes = {
    tag: 'SettingCategory',
    controller: SettingCategory_1.default,
    baseUrl: '/setting-category',
    routes: [
        {
            path: '/setting-category/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: SettingCategory_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all setting categories',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/setting-category/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get setting category by id',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/setting-category',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create setting category',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/setting-category',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update setting category',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
        {
            path: '/setting-category/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete setting category',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(SettingCategoryModel_1.SettingCategorySchema),
    description: 'Operation on SettingCategory model',
};
exports.default = SettingCategoryRoutes;
