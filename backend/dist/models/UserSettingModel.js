"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingSchema = exports.SettingSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
const mongoose_2 = require("mongoose");
const SettingCategoryModel_1 = __importDefault(require("./SettingCategoryModel"));
const UserModel_1 = __importDefault(require("./UserModel"));
exports.SettingSchema = new mongoose_1.Schema({
    name: String,
    value: mongoose_2.SchemaTypes.Mixed,
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: SettingCategoryModel_1.default.modelName,
        required: [true, 'Category ID is required'],
    },
});
exports.UserSettingSchema = new mongoose_1.Schema({
    uid: {
        type: Number,
        ref: UserModel_1.default.modelName,
        required: [true, 'User ID is required'],
    },
    setting: {
        type: exports.SettingSchema,
        required: [true, 'Setting required'],
    },
    settingSupported: Boolean,
});
const UserSettingModel = mongoose_1.default.model(`UserSetting`, (0, TimestampsPlugin_1.default)(exports.UserSettingSchema));
exports.default = UserSettingModel;
