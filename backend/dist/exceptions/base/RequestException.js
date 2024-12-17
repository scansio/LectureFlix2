"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AllError_1 = __importDefault(require("./AllError"));
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
class RequestException extends AllError_1.default {
    sendSignal;
    constructor(controller, message) {
        super();
        this.message = message || 'Request failed';
        this.controller = controller;
        this.controller.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message(this.message);
        this.sendSignal = {
            connection: this.controller.getConnection(),
            data: this.controller.getData(),
        };
    }
}
exports.default = RequestException;
