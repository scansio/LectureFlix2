"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const UserLogModel_1 = __importDefault(require("../../models/lectureFlix/UserLogModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class UserLog extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await UserLogModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('UserLog not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const UserLogs = await new PaginatingModel_1.default(UserLogModel_1.default, this).makePublic(true).exec();
        if (!UserLogs)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No UserLogs').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(UserLogs).send();
    }
    async create({ learner_id, login_time, logout_time }) {
        const created = await UserLogModel_1.default.create({
            learner_id,
            login_time,
            logout_time,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating UserLog').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserLog created').setData(created).send();
    }
    async update({ id, learner_id, login_time, logout_time, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            learner_id,
            login_time,
            logout_time,
            status,
        });
        const updated = await UserLogModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('UserLog failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserLog updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await UserLogModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('UserLog failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('UserLog deleted').setData(deleted).send();
    }
}
exports.default = UserLog;
