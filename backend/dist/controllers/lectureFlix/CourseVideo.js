"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const CourseVideoModel_1 = __importDefault(require("../../models/lectureFlix/CourseVideoModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class CourseVideo extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await CourseVideoModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('CourseVideo not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const CourseVideos = await new PaginatingModel_1.default(CourseVideoModel_1.default, this).makePublic(true).exec();
        if (!CourseVideos)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No CourseVideos').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(CourseVideos).send();
    }
    async create({ course_id, video_id }) {
        const created = await CourseVideoModel_1.default.create({
            course_id,
            video_id,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating CourseVideo').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseVideo created').setData(created).send();
    }
    async update({ id, course_id, video_id, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            course_id,
            video_id,
            status,
        });
        const updated = await CourseVideoModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('CourseVideo failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseVideo updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await CourseVideoModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('CourseVideo failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('CourseVideo deleted').setData(deleted).send();
    }
}
exports.default = CourseVideo;
