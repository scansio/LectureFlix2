"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
const UserModel_1 = __importDefault(require("./UserModel"));
exports.UserProfileSchema = new mongoose_1.default.Schema({
    uid: {
        type: Number,
        ref: UserModel_1.default.modelName,
        required: [true, 'User ID is required'],
    },
    country: Number,
    state: Number,
});
const UserProfileModel = mongoose_1.default.model('UserProfile', (0, TimestampsPlugin_1.default)(exports.UserProfileSchema));
exports.default = UserProfileModel;
