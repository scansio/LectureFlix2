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
exports.UserEmailNotificationSchema = exports.attachmentSchema = exports.recipientSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimestampsPlugin_1 = __importDefault(require("./plugins/TimestampsPlugin"));
exports.recipientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
});
exports.attachmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
});
exports.UserEmailNotificationSchema = new mongoose_1.Schema({
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    subject: {
        type: String,
    },
    header: {
        type: String,
    },
    body: {
        type: String,
    },
    html: {
        type: String,
    },
    replyTo: {
        type: String,
    },
    headers: {
        type: String,
    },
    recipients: {
        type: [exports.recipientSchema],
    },
    attachments: {
        type: [exports.attachmentSchema],
    },
    call2Action: {
        type: String,
    },
    call2ActionText: {
        type: String,
    },
    complimentary: {
        type: String,
    },
    senderName: {
        type: String,
    },
});
const UserEmailNotificationModel = mongoose_1.default.model('UserEmailNotification', (0, TimestampsPlugin_1.default)(exports.UserEmailNotificationSchema));
exports.default = UserEmailNotificationModel;
