"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Define logger configuration
const loggerConfig = {
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
    transports: [
        //new winston.transports.Console(),
        new winston_1.default.transports.File({ filename: 'file_store/logs/error.log', level: 'error' }),
        //new winston.transports.File({ filename: 'file_store/logs/combined.log' })
    ],
};
// Create a new logger instance
const Logger = winston_1.default.createLogger(loggerConfig);
// Export the logger instance
exports.default = Logger;
