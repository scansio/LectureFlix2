"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const CountrieModel_1 = __importDefault(require("../models/CountrieModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
class Countrie extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const countrie = await CountrieModel_1.default.findOne({ id }).exec();
        if (!countrie)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Countrie not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(countrie).send();
    }
    async all() {
        const countries = await new PaginatingModel_1.default(CountrieModel_1.default, this).makePublic(true).exec();
        if (!countries)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Countries not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(countries).send();
    }
    async create(obj) {
        const definedValues = (0, common_1.getDefinedValuesFrom)(obj);
        const created = await CountrieModel_1.default.create(definedValues);
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Countrie').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Countrie created').setData(created).send();
    }
    async update(obj) {
        const definedValues = (0, common_1.getDefinedValuesFrom)(obj);
        const updated = await CountrieModel_1.default.findByIdAndUpdate(obj?.id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Countrie failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Countrie updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await CountrieModel_1.default.findOneAndDelete({ id }).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Countrie failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Countrie deleted').setData(deleted).send();
    }
}
exports.default = Countrie;
