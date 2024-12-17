"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
const User_1 = __importDefault(require("../../../controllers/User"));
const UserModel_1 = require("../../../models/UserModel");
const RequestMethods_1 = require("../../RequestMethods");
const AuthRoutes = {
    tag: 'Authentication',
    baseUrl: '/auth',
    controller: User_1.default,
    routes: [
        {
            path: '/auth/google',
            controllerMemberFunctionIdentifier: User_1.default.prototype.googleOauth2,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Google Oauth2 generate authentication link',
            },
        },
        {
            path: '/auth/verify',
            controllerMemberFunctionIdentifier: User_1.default.prototype.googleOauth2,
            method: RequestMethods_1.RequestMethods.GET,
            metadata: {
                summary: 'Google Oauth2 verify authentication ',
            },
        },
    ],
    schema: (0, common_1.getObject)(UserModel_1.UserSchema),
    description: 'Google sign in',
};
exports.default = AuthRoutes;
