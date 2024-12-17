"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const API_1 = __importDefault(require("../routes/API"));
const AllError_1 = __importDefault(require("../exceptions/base/AllError"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const Authenticate_1 = __importDefault(require("./Authenticate"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const common_1 = require("../common");
const APIVersionStatus_1 = require("../routes/APIVersionStatus");
const RequestValidation_1 = __importDefault(require("./RequestValidation"));
const RequestMethods_1 = require("../routes/RequestMethods");
//import Logger from './Logger'
class Routing {
    PUBLIC = 0;
    PRIVATE = 1;
    ALL = 2;
    app;
    res;
    req;
    next;
    constructor(app) {
        this.app = app;
    }
    __getRoutes() {
        for (const api of API_1.default) {
            if (api.status === APIVersionStatus_1.APIVersionStatus.ENABLED) {
                for (const controllerRoute of api.controllerRoutes) {
                    const controller = controllerRoute.controller;
                    for (const route of controllerRoute.routes) {
                        const endpoint = `/${api.info.version}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
                        const createRoute = async (req, res, next) => {
                            this.req = req;
                            this.res = res;
                            this.next = next;
                            try {
                                const isPrivateMethod = route.requireAuthentication;
                                isPrivateMethod && (await this.authRoute(req));
                                const childSender = new controller(req, res, next);
                                childSender.setExecutingClassName(controller.name);
                                childSender.setIsPrivateRoute(this, isPrivateMethod);
                                const clientDataTemp = {
                                    ...this.req.params,
                                    ...this.req.body,
                                };
                                const clientData = {};
                                for (const clientDataKey in clientDataTemp) {
                                    const clientDataValue = clientDataTemp[clientDataKey];
                                    if (typeof clientDataValue === 'string') {
                                        clientData[clientDataKey] = (0, common_1.sanitizeHTML)(clientDataValue);
                                    }
                                    else {
                                        clientData[clientDataKey] = clientDataValue;
                                    }
                                }
                                ;
                                childSender.clientData = clientData;
                                childSender.directRequest = true;
                                const pre = await childSender?.init();
                                await childSender?.initConstruct();
                                if (!pre) {
                                    const error = new AllError_1.default('Initialization Failure');
                                    error.statusCode = statusCodeConstants_1.SERVER_ERROR;
                                    throw error;
                                }
                                ;
                                (route.controllerMemberFunctionIdentifier ??
                                    controller.prototype[RequestMethods_1.RequestMethodsMap[route.method]])
                                    .call(childSender, clientData)
                                    .catch((error) => next(error));
                            }
                            catch (error) {
                                next(error);
                            }
                        };
                        new RequestValidation_1.default(route.validation).wrap(this.app, createRoute, route.method, endpoint);
                    }
                }
            }
        }
    }
    async authRoute(req) {
        const authenticate = new Authenticate_1.default(req);
        if (!(await authenticate.verify())) {
            const error = new AllError_1.default('Authentication Error');
            error.status = statusCodeConstants_1.BAD_AUTHENTICATION;
            throw error;
        }
        else {
            return (0, common_1.getUser)(this.req);
        }
    }
    sanitize() {
        //TODO Implement sanitization
    }
    publicFileRoutes() {
        this.app?.use('/v*/puf/*', async (req, res, next) => {
            const p = `${req.originalUrl}`;
            const trimmed = p.split('/puf')[1];
            const abp = path_1.default.resolve(`${__dirname}/../../file_store/public${trimmed}`);
            try {
                await (0, promises_1.opendir)(abp);
                const error = new AllError_1.default('Not Found');
                error.status = 404;
                next(error);
            }
            catch (error) {
                res.sendFile(abp, (error) => {
                    if (error) {
                        const e = new AllError_1.default('Not Found');
                        e.status = 404;
                        next(e);
                    }
                });
            }
        });
    }
    privateFileRoutes() {
        this.app?.use('/v*/prf/*', async (req, res, next) => {
            this.req = req;
            this.res = res;
            this.next = next;
            const user = await this.authRoute(req);
            if (!user) {
                const error = new AllError_1.default('Not Found');
                error.status = 404;
                next(error);
            }
            const p = `${req.originalUrl}`;
            const trimmed = p.split('/prf')[1];
            //let abp = path.resolve(__dirname, `../../file_store/private${trimmed}`);
            const abp_u = path_1.default.resolve(__dirname, `../../file_store/private/user/${user?._id}${trimmed}`);
            /* try {
              await opendir(abp);
            } catch (error) {
              if ((error as any).errno !== -2)
                res.sendFile(abp, (error) => {
                  if (error) {
                    let e = new AllError("Not Found");
                    e.status = 404;
                    next(e);
                  }
                });
            } */
            try {
                await (0, promises_1.opendir)(abp_u);
                const error = new AllError_1.default('Not Found');
                error.status = 404;
                next(error);
            }
            catch (error) {
                res.sendFile(abp_u, (error) => {
                    if (error) {
                        const e = new AllError_1.default('Not Found');
                        e.status = 404;
                        next(e);
                    }
                });
            }
        });
    }
    allRoutes() {
        this.publicFileRoutes();
        this.privateFileRoutes();
        this.__getRoutes();
    }
}
exports.default = Routing;
