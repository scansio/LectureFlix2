"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const CourseProgressModel_1 = __importDefault(require("../../models/lectureFlix/CourseProgressModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class CourseProgress extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await CourseProgressModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('CourseProgress not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const CourseProgresss = await new PaginatingModel_1.default(CourseProgressModel_1.default, this).makePublic(true).exec();
        if (!CourseProgresss)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No CourseProgresss').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(CourseProgresss).send();
    }
    async create({ user_id, course_id, progress_percenCourseProgresse, progressStatus, last_updated }) {
        const created = await CourseProgressModel_1.default.create({
            user_id,
            course_id,
            progress_percenCourseProgresse,
            progressStatus,
            last_updated,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating CourseProgress').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseProgress created').setData(created).send();
    }
    async update({ id, user_id, course_id, progress_percenCourseProgresse, progressStatus, last_updated, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            user_id,
            course_id,
            progress_percenCourseProgresse,
            progressStatus,
            last_updated,
            status,
        });
        const updated = await CourseProgressModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('CourseProgress failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseProgress updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await CourseProgressModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('CourseProgress failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseProgress deleted').setData(deleted).send();
    }
}
exports.default = CourseProgress;
