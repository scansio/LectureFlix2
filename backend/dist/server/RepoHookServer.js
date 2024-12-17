"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const Logger_1 = __importDefault(require("../miscs/Logger"));
const RepoHooks_1 = __importDefault(require("../RepoHooks"));
const dotenv_1 = __importDefault(require("dotenv"));
const createSecureServer_1 = __importDefault(require("./createSecureServer"));
const serverConfig_1 = __importDefault(require("./serverConfig"));
(async () => {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const serverName = 'RepoHookServer';
    const REPO_HOOK_SERVER_PORT = serverConfig_1.default.REPO_HOOK_SERVER.port;
    const REPO_HOOK_SERVER_SCHEME = serverConfig_1.default.REPO_HOOK_SERVER.scheme;
    const router = (0, express_1.Router)();
    const server = (0, createSecureServer_1.default)({
        app,
        serverName,
        router,
        scheme: REPO_HOOK_SERVER_SCHEME,
        port: REPO_HOOK_SERVER_PORT,
    });
    await RepoHooks_1.default.instance(router);
    try {
        server.listen(REPO_HOOK_SERVER_PORT, () => {
            console.log(`${serverName} running on port ${REPO_HOOK_SERVER_PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        Logger_1.default.log('error', error);
    }
    return app;
})();
