"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const AssessmentResultsModel_1 = __importDefault(require("../../models/lectureFlix/AssessmentResultsModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class AssessmentResults extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await AssessmentResultsModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('AssessmentResults not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const AssessmentResultss = await new PaginatingModel_1.default(AssessmentResultsModel_1.default, this)
            .makePublic(true)
            .exec();
        if (!AssessmentResultss)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No AssessmentResultss').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(AssessmentResultss).send();
    }
    async create({ user_id, course_id, assessment_score }) {
        const created = await AssessmentResultsModel_1.default.create({
            user_id,
            course_id,
            assessment_score,
            assessment_date: new Date(),
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating AssessmentResults').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('AssessmentResults created').setData(created).send();
    }
    async update({ id, user_id, course_id, assessment_score, assessment_date, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            user_id,
            course_id,
            assessment_score,
            assessment_date,
            status,
        });
        const updated = await AssessmentResultsModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('AssessmentResults failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('AssessmentResults updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await AssessmentResultsModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('AssessmentResults failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('AssessmentResults deleted').setData(deleted).send();
    }
}
exports.default = AssessmentResults;
