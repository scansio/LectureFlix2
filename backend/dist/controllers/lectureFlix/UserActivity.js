"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const UserActivityModel_1 = __importDefault(require("../../models/lectureFlix/UserActivityModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class UserActivity extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await UserActivityModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('UserActivity not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const UserActivitys = await new PaginatingModel_1.default(UserActivityModel_1.default, this).makePublic(true).exec();
        if (!UserActivitys)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No UserActivitys').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(UserActivitys).send();
    }
    async create({ user_id, activity_type, activity_timestamp }) {
        const created = await UserActivityModel_1.default.create({
            user_id,
            activity_type,
            activity_timestamp,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating UserActivity').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserActivity created').setData(created).send();
    }
    async update({ id, user_id, activity_type, activity_timestamp, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            user_id,
            activity_type,
            activity_timestamp,
            status,
        });
        const updated = await UserActivityModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('UserActivity failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserActivity updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await UserActivityModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('UserActivity failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserActivity deleted').setData(deleted).send();
    }
}
exports.default = UserActivity;
