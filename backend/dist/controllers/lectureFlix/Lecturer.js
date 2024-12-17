"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const LecturerModel_1 = __importDefault(require("../../models/lectureFlix/LecturerModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Lecturer extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await LecturerModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Lecturer not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Lecturers = await new PaginatingModel_1.default(LecturerModel_1.default, this).makePublic(true).exec();
        if (!Lecturers)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Lecturers').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Lecturers).send();
    }
    async create({ full_name, email, expertise, university_id }) {
        const created = await LecturerModel_1.default.create({
            full_name,
            email,
            expertise,
            university_id,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Lecturer').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Lecturer created').setData(created).send();
    }
    async update({ id, full_name, email, expertise, university_id, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            full_name,
            email,
            expertise,
            university_id,
            status,
        });
        const updated = await LecturerModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Lecturer failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Lecturer updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await LecturerModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Lecturer failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Lecturer deleted').setData(deleted).send();
    }
}
exports.default = Lecturer;
