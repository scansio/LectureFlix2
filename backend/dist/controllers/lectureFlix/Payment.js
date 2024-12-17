"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const PaymentModel_1 = __importDefault(require("../../models/lectureFlix/PaymentModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Payment extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await PaymentModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Payment not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Payments = await new PaginatingModel_1.default(PaymentModel_1.default, this).makePublic(true).exec();
        if (!Payments)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Payments').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Payments).send();
    }
    async create({ learner_id, amount, payment_method }) {
        const created = await PaymentModel_1.default.create({
            learner_id,
            amount,
            payment_method,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Payment').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Payment created').setData(created).send();
    }
    async update({ id, learner_id, amount, payment_method, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            learner_id,
            amount,
            payment_method,
            status,
        });
        const updated = await PaymentModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Payment failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Payment updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await PaymentModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Payment failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Payment deleted').setData(deleted).send();
    }
}
exports.default = Payment;
