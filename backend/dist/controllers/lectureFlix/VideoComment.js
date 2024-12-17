"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const VideoCommentModel_1 = __importDefault(require("../../models/lectureFlix/VideoCommentModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class VideoComment extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await VideoCommentModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('VideoComment not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const VideoComments = await new PaginatingModel_1.default(VideoCommentModel_1.default, this).makePublic(true).exec();
        if (!VideoComments)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No VideoComments').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(VideoComments).send();
    }
    async create({ video_id, comment_text }) {
        const created = await VideoCommentModel_1.default.create({
            video_id,
            comment_text,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating VideoComment').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('VideoComment created').setData(created).send();
    }
    async update({ id, video_id, comment_text, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            video_id,
            comment_text,
            status,
        });
        const updated = await VideoCommentModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('VideoComment failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('VideoComment updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await VideoCommentModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('VideoComment failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('VideoComment deleted').setData(deleted).send();
    }
}
exports.default = VideoComment;
