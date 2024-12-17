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
const BaseController_1 = __importDefault(require("./base/BaseController"));
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const NotFoundException_1 = __importDefault(require("../exceptions/NotFoundException"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const AuthenticationException_1 = __importDefault(require("../exceptions/AuthenticationException"));
class DataStore extends BaseController_1.default {
    _normalAccess;
    set normalAccess(value) {
        if (this.directRequest) {
            throw new AuthenticationException_1.default(this, "You can't do that");
        }
        this._normalAccess = value;
    }
    constructor(req, res, next) {
        super(req, res, next);
        this._normalAccess = false;
    }
    async all({ store }) {
        if (!this._normalAccess) {
            await this.adminAccess();
        }
        if (!store) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        let storeModel;
        try {
            storeModel = (await Promise.resolve(`${`../models/${store}Model`}`).then(s => __importStar(require(s)))).default;
        }
        catch (error) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        const found = await new PaginatingModel_1.default(storeModel, this).makePublic(true).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Store not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async count({ store }) {
        if (!this._normalAccess) {
            await this.adminAccess();
        }
        if (!store) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        let storeModel;
        try {
            storeModel = (await Promise.resolve(`${`../models/${store}Model`}`).then(s => __importStar(require(s)))).default;
        }
        catch (error) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        const count = await new PaginatingModel_1.default(storeModel, this).makePublic(true).setCountOnly(true).exec();
        this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(count).send();
    }
    async sum({ store, field }) {
        if (!this._normalAccess) {
            await this.adminAccess();
        }
        if (!store) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        let storeModel;
        try {
            storeModel = (await Promise.resolve(`${`../models/${store}Model`}`).then(s => __importStar(require(s)))).default;
        }
        catch (error) {
            throw new NotFoundException_1.default(this, 'Data Store not found');
        }
        const sum = await new PaginatingModel_1.default(storeModel, this).makePublic(true).setSumField(field).exec();
        this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(sum).send();
    }
}
exports.default = DataStore;
