"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Certificate_1 = __importDefault(require("../../../../controllers/lectureFlix/Certificate"));
const CertificateModel_1 = require("../../../../models/lectureFlix/CertificateModel");
const RequestMethods_1 = require("../../../RequestMethods");
const CertificateRoutes = {
    tag: 'Certificate',
    controller: Certificate_1.default,
    baseUrl: '/certificate',
    routes: [
        {
            path: '/certificate/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Certificate_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all certificates',
            },
        },
        {
            path: '/certificate/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get certificate by id',
            },
        },
        {
            path: '/certificate',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create certificate',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/certificate',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update certificate',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/certificate/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete certificate',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(CertificateModel_1.CertificateSchema),
    description: 'Operation on certificate',
};
exports.default = CertificateRoutes;
