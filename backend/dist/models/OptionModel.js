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
exports.OptionSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
exports.OptionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required'],
    },
    value: {
        type: mongoose_1.default.SchemaTypes.Mixed,
    },
    description: String,
    isPublic: {
        type: Boolean,
        default: false,
    },
});
exports.OptionSchema.static('get', async function (name, value = true) {
    const option = await this.findOne({ name }).exec();
    return value ? option?.value : option;
});
const OptionModel = mongoose_1.default.model(`Option`, (0, TimestampsPlugin_1.default)(exports.OptionSchema));
exports.default = OptionModel;
