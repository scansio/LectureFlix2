"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const SubscriptionModel_1 = __importDefault(require("../../models/lectureFlix/SubscriptionModel"));
const PaginatingModel_1 = __importDefault(require("../../models/PaginatingModel"));
const BaseController_1 = __importDefault(require("../base/BaseController"));
class Subscription extends BaseController_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    async init() {
        return true;
    }
    async get({ id }) {
        const found = await SubscriptionModel_1.default.findById(`${id}`).exec();
        if (!found)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Subscription not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(found).send();
    }
    async all() {
        const Subscriptions = await new PaginatingModel_1.default(SubscriptionModel_1.default, this).makePublic(true).exec();
        if (!Subscriptions)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('No Subscriptions').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Subscriptions).send();
    }
    async create({ learner_id, subscription_type, start_date, end_date }) {
        const created = await SubscriptionModel_1.default.create({
            learner_id,
            subscription_type,
            start_date,
            end_date,
        });
        if (!created)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Error creating Subscription').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Subscription created').setData(created).send();
    }
    async update({ id, learner_id, subscription_type, start_date, end_date, status }) {
        const definedValues = (0, common_1.getDefinedValuesFrom)({
            learner_id,
            subscription_type,
            start_date,
            end_date,
            status,
        });
        const updated = await SubscriptionModel_1.default.findByIdAndUpdate(id, definedValues, {
            new: true,
        }).exec();
        if (!updated)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Subscription failed to update due to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Subscription updated').setData(updated).send();
    }
    async delete({ id }) {
        const deleted = await SubscriptionModel_1.default.findByIdAndDelete(id).exec();
        if (!deleted)
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('Subscription failed to be deleted do to error').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Subscription deleted').setData(deleted).send();
    }
}
exports.default = Subscription;
