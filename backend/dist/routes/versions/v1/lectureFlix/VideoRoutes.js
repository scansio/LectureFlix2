"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const Video_1 = __importDefault(require("../../../../controllers/lectureFlix/Video"));
const VideoModel_1 = require("../../../../models/lectureFlix/VideoModel");
const RequestMethods_1 = require("../../../RequestMethods");
const VideoRoutes = {
    tag: 'Video',
    controller: Video_1.default,
    baseUrl: '/video',
    routes: [
        {
            path: '/video/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: Video_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all videos',
            },
        },
        {
            path: '/video/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get video by id',
            },
        },
        {
            path: '/video',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/video',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/video/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete video',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(VideoModel_1.VideoSchema),
    description: 'Operation on video',
};
exports.default = VideoRoutes;
