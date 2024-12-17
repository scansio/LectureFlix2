"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodeConstants_1 = require("../configs/errorCodeConstants");
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const RequestException_1 = __importDefault(require("./base/RequestException"));
class MaintenanceException extends RequestException_1.default {
    constructor(controller, message) {
        super(controller, message || 'Server under maintenance try again shortly');
        this.sendSignal.connection.statusCode = statusCodeConstants_1.SERVICE_UNAVAILABLE;
        this.sendSignal.connection.errorCode = errorCodeConstants_1.SERVER_UNDER_MAINTENANCE;
    }
}
exports.default = MaintenanceException;
