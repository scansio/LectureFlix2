"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const CourseModel_1 = __importDefault(require("../../models/lectureFlix/CourseModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Course extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await CourseModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Course not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Courses = await new PaginatingModel_1.default(CourseModel_1.default, this).makePublic(true).exec();
        if (!Courses)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Courses').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Courses).send();
    }
    async create({ course_name, lecturer_id, course_description }) {
        const created = await CourseModel_1.default.create({
            course_name,
            lecturer_id,
            course_description,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Course').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Course created').setData(created).send();
    }
    async update({ id, course_name, lecturer_id, course_description, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            course_name,
            lecturer_id,
            course_description,
            status,
        });
        const updated = await CourseModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Course failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Course updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await CourseModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Course failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Course deleted').setData(deleted).send();
    }
}
exports.default = Course;
