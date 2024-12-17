"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const RequestException_1 = __importDefault(require("./base/RequestException"));
class ServiceUnavailableException extends RequestException_1.default {
    constructor(controller, message) {
        super(controller, message || 'Service unavailable try again shortly');
        this.sendSignal.connection.statusCode = statusCodeConstants_1.SERVICE_UNAVAILABLE;
    }
}
exports.default = ServiceUnavailableException;
