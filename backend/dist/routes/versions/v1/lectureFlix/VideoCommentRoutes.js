"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const constants_1 = require("../../../../configs/constants");
const VideoComment_1 = __importDefault(require("../../../../controllers/lectureFlix/VideoComment"));
const VideoCommentModel_1 = require("../../../../models/lectureFlix/VideoCommentModel");
const RequestMethods_1 = require("../../../RequestMethods");
const VideoCommentRoutes = {
    tag: 'VideoComment',
    controller: VideoComment_1.default,
    baseUrl: '/video-comment',
    routes: [
        {
            path: '/video-comment/all',
            validation: { query: { q: {} } },
            controllerMemberFunctionIdentifier: VideoComment_1.default.prototype.all,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get all video comments',
            },
        },
        {
            path: '/video-comment/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Get video comment by id',
            },
        },
        {
            path: '/video-comment',
            method: RequestMethods_1.RequestMethods.POST,
            metadata: {
                summary: 'Create video comment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/video-comment',
            method: RequestMethods_1.RequestMethods.PATCH,
            metadata: {
                summary: 'Update video comment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.END_USER,
        },
        {
            path: '/video-comment/:id([0-9a-fA-F]{24})',
            validation: {
                param: {
                    id: {
                        notEmpty: {},
                    },
                },
            },
            method: RequestMethods_1.RequestMethods.DELETE,
            metadata: {
                summary: 'Delete video comment',
            },
            requireAuthentication: constants_1.AuthenticationLevel.ADMIN,
        },
    ],
    schema: (0, common_1.getObject)(VideoCommentModel_1.VideoCommentSchema),
    description: 'Operation on video comment',
};
exports.default = VideoCommentRoutes;
