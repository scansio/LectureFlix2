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
exports.UserEmailAuthenticationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
const UserModel_1 = __importDefault(require("./UserModel"));
exports.UserEmailAuthenticationSchema = new mongoose_1.Schema({
    uid: {
        type: Number,
        ref: UserModel_1.default.modelName,
        required: [true, 'User ID is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    code: {
        type: Number,
        required: [true, 'Generated Code is required'],
    },
    extra: String,
    duration: {
        type: Number,
        required: [true, 'Specify time in milliseconds when the code is generated'],
    },
});
const UserEmailAuthenticationModel = mongoose_1.default.model('UserEmailAuthentication', (0, TimestampsPlugin_1.default)(exports.UserEmailAuthenticationSchema));
exports.default = UserEmailAuthenticationModel;
