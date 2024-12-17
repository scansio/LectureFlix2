"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const SettingCategoryModel_1 = __importDefault(require("../models/SettingCategoryModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
class SettingCategory extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await SettingCategoryModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Category not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const settingCategories = await new PaginatingModel_1.default(SettingCategoryModel_1.default, this).exec();
        if (!settingCategories)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Setting Categories not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(settingCategories).send();
    }
    async create({ name }) {
        const created = await SettingCategoryModel_1.default.create({
            name,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Category').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Category created').setData(created).send();
    }
    async update({ id, name }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            name,
        });
        const updated = await SettingCategoryModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Category failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Category updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await SettingCategoryModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Category failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Category deleted').setData(deleted).send();
    }
}
exports.default = SettingCategory;
