"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const OptionModel_1 = __importDefault(require("../models/OptionModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const errorCodeConstants_1 = require("../configs/errorCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
class Option extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ name }) {
        const option = await OptionModel_1.default.findOne({
            name,
        }).exec();
        if (!option) {
            this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE).errorCode(errorCodeConstants_1.OPTION_NOTFOUND).message(`${name} option not found`).send();
        }
        else {
            this.statusCode(statusCodeConstants_1.GET_SUCCESS).message('Success').status(true).setData(option).send();
        }
    }
    async all() {
        const options = await new PaginatingModel_1.default(OptionModel_1.default, this).exec();
        if (!options)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Options not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(options).send();
    }
    async create({ name, value, description, isPublic }) {
        isPublic === 1 && (isPublic = true);
        try {
            const created = await OptionModel_1.default.create({
                name,
                value,
                description,
                isPublic,
            });
            this.statusCode(statusCodeConstants_1.POST_SUCCESS).message('Option created').status(true).setData(created);
        }
        catch (error) {
            this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE)
                .errorCode(errorCodeConstants_1.UNABLE_TO_COMPLETE_REQUEST)
                .message(error.message);
        }
        this.send();
    }
    async update({ id, name, value, description, isPublic }) {
        isPublic === 1 && (isPublic = true);
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            name,
            value,
            description,
            isPublic,
        });
        const updated = await OptionModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Option failed to update').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Option updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await OptionModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Option failed to be deleted').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Option deleted').setData(deleted).send();
    }
    async publics() {
        const options = await OptionModel_1.default.find({
            isPublic: true,
        }).exec();
        if (!options) {
            this.statusCode(statusCodeConstants_1.SERVICE_UNAVAILABLE).errorCode(errorCodeConstants_1.OPTION_NOTFOUND).message(`Public options not found`);
        }
        else {
            this.statusCode(statusCodeConstants_1.GET_SUCCESS).message('Success').status(true).setData(options);
        }
        this.send();
    }
}
exports.default = Option;
