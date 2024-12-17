"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodeConstants_1 = require("./configs/statusCodeConstants");
const Logger_1 = __importDefault(require("./miscs/Logger"));
const SharedConfig_1 = __importDefault(require("./libs/SharedConfig"));
/**
 * This is express middleware that serves as the central place
 * where response are being sent back to client.
 *
 * @see {@link IResStruct}
 *
 * @param error Error that triggered this middleware
 * @param req Request
 * @param res Response
 * @param _next Next middleware function
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const terminator = (error, req, res, next) => {
    if (error.sendSignal) {
        res.status(error.sendSignal.connection.statusCode).json(error.sendSignal);
    }
    else {
        const connection = {
            endpoint: SharedConfig_1.default.get('requestUrl'),
            statusCode: error?.status || statusCodeConstants_1.BAD_REQUEST,
        };
        req?.user?.uid &&
            (connection.uid = req.user?.uid);
        error.errorCode && (connection.errorCode = error.errorCode);
        const { status, message } = error.data || {
            status: false,
            message: error?.status == statusCodeConstants_1.SERVER_ERROR ? 'Internal Error' : error.message,
        };
        connection.status = status;
        connection.message = message;
        const d = {
            connection: connection,
            data: {},
        };
        if (error.name === 'ValidationError') {
            d.connection.message = '';
            for (const path in error.errors) {
                if (Object.prototype.hasOwnProperty.call(error.errors, path)) {
                    const errorT = error.errors[path];
                    d.connection.message += errorT.message + '\n';
                }
            }
        }
        else if (error.name === 'MongoServerError' && error.code == 11000) {
            d.connection.message = '';
            if (error.errors) {
                for (const path in error.errors) {
                    if (Object.prototype.hasOwnProperty.call(error.errors, path)) {
                        const errorT = error.errors[path];
                        const [p, value] = Object.entries(errorT.keyValue)[0];
                        d.connection.message += `${p}: ${value} already exist\n`;
                    }
                }
            }
            else {
                const [path, value] = Object.entries(error.keyValue)[0];
                d.connection.message += `${path}: ${value} already exist\n`;
            }
        }
        else if (error.name === 'MongooseServerSelectionError') {
            d.connection.message = `Server connection error`;
            d.connection.statusCode = statusCodeConstants_1.SERVER_ERROR;
        }
        else {
            Logger_1.default.log('error', { error, d });
        }
        res.status(connection.statusCode).json(d);
    }
};
exports.default = terminator;
