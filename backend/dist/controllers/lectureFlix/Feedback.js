"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const FeedbackModel_1 = __importDefault(require("../../models/lectureFlix/FeedbackModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Feedback extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await FeedbackModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Feedback not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Feedbacks = await new PaginatingModel_1.default(FeedbackModel_1.default, this).makePublic(true).exec();
        if (!Feedbacks)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Feedbacks').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Feedbacks).send();
    }
    async create({ user_id, course_id, feedback_text, rating, submitted_at }) {
        const created = await FeedbackModel_1.default.create({
            user_id,
            course_id,
            feedback_text,
            rating,
            submitted_at,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Feedback').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Feedback created').setData(created).send();
    }
    async update({ id, user_id, course_id, feedback_text, rating, submitted_at, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            user_id,
            course_id,
            feedback_text,
            rating,
            submitted_at,
            status,
        });
        const updated = await FeedbackModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Feedback failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Feedback updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await FeedbackModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Feedback failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Feedback deleted').setData(deleted).send();
    }
}
exports.default = Feedback;
