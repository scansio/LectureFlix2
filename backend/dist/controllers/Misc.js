"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
class Misc extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async topGainer() {
        const topGainer = await UserModel_1.default.findOne().sort({ currentMonthProfit: 'descending' }).exec();
        this.success('Top Gainer of the Month').setData(topGainer).send();
    }
}
exports.default = Misc;
