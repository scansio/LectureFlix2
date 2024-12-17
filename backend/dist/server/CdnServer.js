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
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const createSecureServer_1 = __importDefault(require("./createSecureServer"));
const Logger_1 = __importDefault(require("../miscs/Logger"));
const serverConfig_1 = __importDefault(require("./serverConfig"));
(async () => {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const router = (0, express_1.Router)();
    const serverName = 'CdnServer';
    const CDN_PORT = serverConfig_1.default.CDN_SERVER.port;
    const CDN_SCHEME = serverConfig_1.default.CDN_SERVER.scheme;
    // Enable compression for all responses
    app.use((0, compression_1.default)());
    const server = (0, createSecureServer_1.default)({
        app,
        router,
        serverName,
        scheme: CDN_SCHEME,
        port: CDN_PORT,
    });
    const cdnDir = path.join(__dirname, '..', '..', 'cdn');
    router.use(express_1.default.static(cdnDir, {
        maxAge: '1d',
        setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=86400');
            //res.setHeader('Content-Security-Policy', "default-src 'self'");
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        },
    }));
    process.on('uncaughtException', (err) => {
        Logger_1.default.log('error', err);
    });
    process.on('unhandledRejection', (reason) => {
        Logger_1.default.log('error', reason);
    });
    server.listen(CDN_PORT, () => {
        console.log(`${serverName} running on port ${CDN_PORT}`);
    });
    return app;
})();
