"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serverConfig = {
    SCHEDULING_SERVER: {
        scheme: process.env.SCHEDULING_SERVER_SCHEME || 'scheduling',
        port: process.env.SCHEDULING_SERVER_PORT || 6098,
    },
    MAIN_SERVER: {
        scheme: process.env.MAIN_SERVER_SCHEME || 'main',
        port: process.env.MAIN_SERVER_PORT || 3003,
    },
    REPO_HOOK_SERVER: {
        scheme: process.env.REPO_HOOK_SERVER_SCHEME || 'hook',
        port: process.env.REPO_HOOK_SERVER_PORT || 3002,
    },
    CDN_SERVER: {
        scheme: process.env.CDN_SCHEME || 'cdn',
        port: process.env.CDN_PORT || 2024,
    },
    SOCKET_SERVER: {
        scheme: process.env.SOCKET_SERVER_SCHEME || 'socket',
        port: process.env.SOCKET_SERVER_PORT || 2025,
    },
};
exports.default = serverConfig;
