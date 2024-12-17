"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const VideoModel_1 = __importDefault(require("../../models/lectureFlix/VideoModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Video extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await VideoModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Video not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Videos = await new PaginatingModel_1.default(VideoModel_1.default, this).makePublic(true).exec();
        if (!Videos)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Videos').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Videos).send();
    }
    async create({ course_id, video_title, video_description, upload_date, video_access }) {
        const created = await VideoModel_1.default.create({
            course_id,
            video_title,
            video_description,
            upload_date,
            video_access,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Video').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Video created').setData(created).send();
    }
    async update({ id, course_id, video_title, video_description, upload_date, video_access, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            course_id,
            video_title,
            video_description,
            upload_date,
            video_access,
            status,
        });
        const updated = await VideoModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Video failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Video updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await VideoModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Video failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Video deleted').setData(deleted).send();
    }
}
exports.default = Video;
