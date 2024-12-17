"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const LearnerModel_1 = __importDefault(require("../../models/lectureFlix/LearnerModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Learner extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await LearnerModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Learner not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Learners = await new PaginatingModel_1.default(LearnerModel_1.default, this).makePublic(true).exec();
        if (!Learners)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Learners').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Learners).send();
    }
    async create({ full_name, email, password, country, date_of_birth }) {
        const created = await LearnerModel_1.default.create({
            full_name,
            email,
            password,
            country,
            date_of_birth,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Learner').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Learner created').setData(created).send();
    }
    async update({ id, full_name, email, password, country, date_of_birth, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            full_name,
            email,
            password,
            country,
            date_of_birth,
            status,
        });
        const updated = await LearnerModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Learner failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Learner updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await LearnerModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Learner failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Learner deleted').setData(deleted).send();
    }
}
exports.default = Learner;
