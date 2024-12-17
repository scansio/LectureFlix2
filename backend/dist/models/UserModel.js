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
exports.UserSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../configs/constants");
const md5_1 = __importDefault(require("../libs/md5"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
exports.UserSchema = new mongoose_1.Schema({
    _id: {
        type: Number,
        required: [true, 'Generate ID for User'],
    },
    refID: {
        type: Number,
        ref: 'User',
    },
    firstname: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        lowercase: true,
        email: true,
        unique: true,
        index: true,
        /* validate: {
          validator: async (email: string) => {
            const existed = await UserModel.findOne({ email }).exec();
            if (existed) {
              return false;
            }
            return true;
          },
          message: "User Already Exist",
        }, */
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        set: (password) => password && (0, md5_1.default)(`${password}`),
    },
    pin: {
        type: String,
        set: (pin) => pin && (0, md5_1.default)(`${pin}`),
    },
    status: {
        type: Number,
        default: constants_1.INACTIVE,
    },
    oauth: Boolean,
    role: {
        type: String,
        enum: constants_1.AuthenticationLevel,
        default: constants_1.AuthenticationLevel.END_USER,
    },
    dob: Date,
    phone: { type: Number, minLength: 7, maxLength: 10 /* , required: true */ },
    bio: String,
    avatar: String,
});
const UserModel = mongoose_1.default.model('User', (0, TimestampsPlugin_1.default)(exports.UserSchema));
exports.default = UserModel;
