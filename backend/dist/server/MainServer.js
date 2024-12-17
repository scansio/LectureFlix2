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
/* eslint-disable @typescript-eslint/no-explicit-any */
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Routing_1 = __importDefault(require("../miscs/Routing"));
const terminator_1 = __importDefault(require("../terminator"));
const createSecureServer_1 = __importStar(require("./createSecureServer"));
const serverConfig_1 = __importDefault(require("./serverConfig"));
(async () => {
    const app = (0, express_1.default)();
    dotenv_1.default.config();
    const MAIN_SERVER_PORT = serverConfig_1.default.MAIN_SERVER.port;
    const MAIN_SERVER_SCHEME = serverConfig_1.default.MAIN_SERVER.scheme;
    const router = (0, express_1.Router)();
    const serverName = 'MainServer';
    const server = (0, createSecureServer_1.default)({
        app,
        serverName,
        router,
        scheme: MAIN_SERVER_SCHEME,
        port: MAIN_SERVER_PORT,
    });
    const dbConnectionString = (process.env.ENVIRONMENT === 'production' ? process.env.MONGO_URI_PASS : process.env.MONGO_URI_PASS_LOCAL);
    const routing = new Routing_1.default(router);
    routing.allRoutes();
    app.use(terminator_1.default);
    mongoose_1.default.set('strictQuery', true);
    //mongoose.set('debug', true)
    try {
        const mongodb = await mongoose_1.default.connect(dbConnectionString);
        server.listen(MAIN_SERVER_PORT, '0.0.0.0', () => {
            console.log(`${serverName} running on port ${MAIN_SERVER_PORT}`);
        });
        (0, createSecureServer_1.onClose)(server, mongodb.disconnect);
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
    return app;
})();
