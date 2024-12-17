"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const SettingModel_1 = __importDefault(require("../models/SettingModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
class Setting extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await SettingModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Setting not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const settings = await new PaginatingModel_1.default(SettingModel_1.default, this).exec();
        if (!settings)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Setting not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(settings).send();
    }
    async create({ name, value, category }) {
        const created = await SettingModel_1.default.create({
            name,
            value,
            category,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Setting').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Setting created').setData(created).send();
    }
    async update({ id, name, value, category }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            name,
            value,
            category,
        });
        const updated = await SettingModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Setting failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Setting updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await SettingModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Setting failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Setting deleted').setData(deleted).send();
    }
}
exports.default = Setting;
