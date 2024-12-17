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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = __importDefault(require("../miscs/Logger"));
const CronDefinition_1 = __importDefault(require("../cronjobs/config/CronDefinition"));
const createSecureServer_1 = __importStar(require("./createSecureServer"));
const serverConfig_1 = __importDefault(require("./serverConfig"));
(async () => {
    const app = (0, express_1.default)();
    dotenv_1.default.config();
    const serverName = 'SchedulingServer';
    const SCHEDULING_SERVER_PORT = serverConfig_1.default.SCHEDULING_SERVER.port;
    const SCHEDULING_SERVER_SCHEME = serverConfig_1.default.SCHEDULING_SERVER.scheme;
    const router = (0, express_1.Router)();
    const server = (0, createSecureServer_1.default)({
        app,
        serverName,
        router,
        scheme: SCHEDULING_SERVER_SCHEME,
        port: SCHEDULING_SERVER_PORT,
    });
    const dbConnectionString = (process.env.ENVIRONMENT === 'production' ? process.env.MONGO_URI_PASS : process.env.MONGO_URI_PASS_LOCAL);
    mongoose_1.default.set('strictQuery', true);
    try {
        const mongodb = await mongoose_1.default.connect(dbConnectionString);
        server.listen(SCHEDULING_SERVER_PORT, () => {
            console.log(`${serverName} running on port ${SCHEDULING_SERVER_PORT}`);
            new CronDefinition_1.default().start().catch((error) => {
                Logger_1.default.log('error', error);
                //console.log(error, '\n\n')
            });
        });
        (0, createSecureServer_1.onClose)(server, mongodb.disconnect);
    }
    catch (error) {
        Logger_1.default.log('error', error);
        //console.log(error, '\n\n')
        process.exit();
    }
    return app;
})();
