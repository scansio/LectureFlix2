"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const UserSettingModel_1 = __importDefault(require("../models/UserSettingModel"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const PaginatingModel_1 = __importDefault(require("../models/PaginatingModel"));
const common_1 = require("../common");
const SettingModel_1 = __importDefault(require("../models/SettingModel"));
class UserSetting extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async get({ name, uid }) {
        await this.ownerAndAdminAccess(uid || this?.user?._id);
        const userSettingModel = await UserSettingModel_1.default.findOne({
            uid,
            'setting.name': name,
        }).exec();
        if (!userSettingModel)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('User setting not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(userSettingModel).send();
    }
    async all() {
        const userSettingsFn = async () => await new PaginatingModel_1.default(UserSettingModel_1.default, this).populate('setting.category').exec();
        let userSettings = (await userSettingsFn());
        if (!userSettings || userSettings?.results.length < 1) {
            this.directRequest = false; //To reuse create function
            await this.create({ uid: this?.user?._id });
            this.directRequest = true; //Set it back after using create function
            userSettings = (await userSettingsFn());
        }
        this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(userSettings).send();
    }
    async create({ uid }) {
        await this.ownerAndAdminAccess(uid || this?.user?._id);
        await UserSettingModel_1.default.deleteMany({ uid }).exec();
        const defaultSettings = await SettingModel_1.default.find().exec();
        for (const defaultSetting of defaultSettings) {
            try {
                await UserSettingModel_1.default.create({
                    uid,
                    setting: {
                        name: defaultSetting?.name,
                        value: defaultSetting?.value,
                        category: defaultSetting?.category,
                    },
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        if (!this.directRequest) {
            const settings = await UserSettingModel_1.default.find({ uid }).exec();
            return settings;
        }
        this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('User setting created').send();
    }
    async update({ uid, settings }) {
        if (!uid) {
            uid = this?.user?._id;
        }
        await this.ownerAndAdminAccess(uid);
        if (Array.isArray(settings)) {
            for (const setting of settings) {
                const definedValues = (0, common_1.getDefinedValuesFrom)({
                    name: setting?.name,
                    value: setting?.value,
                });
                const settingModel = await SettingModel_1.default.findOne({
                    name: definedValues?.name,
                }).exec();
                const existed = await UserSettingModel_1.default.findOneAndDelete({
                    uid,
                    'setting.name': definedValues?.name,
                }).exec();
                if (existed) {
                    await UserSettingModel_1.default.create({
                        uid,
                        setting: {
                            name: definedValues?.name,
                            value: definedValues?.value,
                            category: settingModel?.category,
                        },
                    });
                }
            }
        }
        else {
            const definedValues = (0, common_1.getDefinedValuesFrom)({
                name: settings?.name,
                value: settings?.value,
            });
            const settingModel = await SettingModel_1.default.findOne({
                'setting.name': definedValues?.name,
            }).exec();
            const existed = await UserSettingModel_1.default.findOneAndDelete({
                uid,
                name: definedValues?.name,
            }).exec();
            if (existed) {
                await UserSettingModel_1.default.create({
                    uid,
                    setting: {
                        name: definedValues?.name,
                        value: definedValues?.value,
                        category: settingModel?.category,
                    },
                });
            }
        }
        this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('User setting updated').send();
    }
    async reset({ uid }) {
        uid = uid || this?.user?._id;
        await this.ownerAndAdminAccess(uid);
        const deleted = await UserSettingModel_1.default.deleteMany({ uid }).exec();
        this.directRequest = false; //To reuse create function
        const recreated = deleted && (await this.create({ uid: uid || this?.user?._id }));
        this.directRequest = true; //Set it back after using create function
        if (!recreated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('User setting failed to be reset do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).message('User setting reseted').setData(recreated).send();
    }
    async delete({ id }) {
        await this.adminAccess();
        const deleted = await UserSettingModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('User setting failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('User setting deleted').setData(deleted).send();
    }
}
exports.default = UserSetting;
