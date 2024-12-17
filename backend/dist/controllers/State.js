"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const StateModel_1 = __importDefault(require("../models/StateModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
class State extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const state = await StateModel_1.default.findOne({ id }).exec();
        if (!state)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('State not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(state).send();
    }
    async all() {
        const states = await new PaginatingModel_1.default(StateModel_1.default, this).makePublic(true).exec();
        if (!states)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('States not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(states).send();
    }
    async create(obj) {
        const definedValues = (0, common_1.getDefinedValuesFrom)(obj);
        const created = await StateModel_1.default.create(definedValues);
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating State').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('State created').setData(created).send();
    }
    async update(obj) {
        const definedValues = (0, common_1.getDefinedValuesFrom)(obj);
        const updated = await StateModel_1.default.findByIdAndUpdate(obj?.id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('State failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('State updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await StateModel_1.default.findOneAndDelete({ id }).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('State failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('State deleted').setData(deleted).send();
    }
}
exports.default = State;
