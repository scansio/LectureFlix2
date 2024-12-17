"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AllError_1 = __importDefault(require("../../exceptions/base/AllError"));
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const CronJob_1 = __importDefault(require("../../cronjobs/base/CronJob"));
const Routing_1 = __importDefault(require("../../miscs/Routing"));
class Sender {
    app;
    _req;
    directRequest = false;
    _cronJobAccess = false;
    get cronJobAccess() {
        return this._cronJobAccess;
    }
    set cronJobAccess(value) { }
    setCronJobAccess(accessor, accessing) {
        if (accessor instanceof CronJob_1.default) {
            this._cronJobAccess = !!accessing;
        }
    }
    _clientData;
    get clientData() {
        return this._clientData;
    }
    set clientData(value) {
        this._clientData = value;
    }
    get req() {
        return this._req;
    }
    _res;
    get res() {
        return this._res;
    }
    _next;
    get next() {
        return this._next;
    }
    user;
    _data = {};
    _privateRoute;
    get isPrivateRoute() {
        return this._privateRoute;
    }
    set isPrivateRoute(value) { }
    setIsPrivateRoute(setter, value) {
        if (setter instanceof Routing_1.default) {
            this._privateRoute = value;
        }
    }
    _connection;
    notImplementedError;
    executingClassName;
    constructor(req, res, next) {
        if (res && req && next) {
            this._req = req;
            this._res = res;
            this._next = next;
            this.user = this.req.user;
            const uid = this.user?._id;
            const connection = {
                endpoint: this.req.baseUrl + this.req.url,
                statusCode: statusCodeConstants_1.BAD_REQUEST,
                status: false,
                message: 'Error',
            };
            uid && (connection.uid = `${uid}`);
            this._connection = connection;
            this._data = {};
            this.notImplementedError = new AllError_1.default('Method not implemented.');
            this.notImplementedError.status = statusCodeConstants_1.SERVER_ERROR;
        }
    }
    initConstruct() {
        throw this.notImplementedError;
    }
    async init() {
        return true;
    }
    getData() {
        return this._data;
    }
    setData(value) {
        this._data = value;
        return this;
    }
    getConnection() {
        return this._connection;
    }
    connection(key, value) {
        ;
        this._connection[key] = value;
        return this;
    }
    status(value) {
        this._connection.status = value;
        return this;
    }
    error(message = null) {
        this.status(false);
        message && this.message(message);
        return this;
    }
    success(message = null) {
        this.status(true);
        message && this.message(message);
        return this;
    }
    message(value) {
        this._connection.message = value;
        return this;
    }
    endpoint(value) {
        this._connection.endpoint = value;
        return this;
    }
    statusCode(value) {
        this._connection.statusCode = value;
        return this;
    }
    errorCode(value) {
        this._connection.errorCode = value;
        return this;
    }
    uid(value) {
        this._connection.uid = value;
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get(data) {
        this.next(this.notImplementedError);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(data) {
        this.next(this.notImplementedError);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async update(data) {
        this.next(this.notImplementedError);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async delete(data) {
        this.next(this.notImplementedError);
    }
    setExecutingClassName(econtroller) {
        this.executingClassName = econtroller;
    }
    send() {
        if (this.directRequest) {
            if (this._connection.status && this._connection.statusCode == statusCodeConstants_1.BAD_REQUEST) {
                this._connection.statusCode = statusCodeConstants_1.POST_SUCCESS;
            }
            if (this._connection.status && (this._connection.message === 'Error' || this._connection.message === '')) {
                this._connection.message = 'Success';
            }
            const resData = {
                connection: this._connection,
                data: this._data,
            };
            const sendSignal = new AllError_1.default();
            sendSignal.sendSignal = resData;
            throw sendSignal;
        }
    }
}
exports.default = Sender;
