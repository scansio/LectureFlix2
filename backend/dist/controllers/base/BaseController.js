"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sender_1 = __importDefault(require("./Sender"));
const AllError_1 = __importDefault(require("../../exceptions/base/AllError"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const constants_1 = require("../../configs/constants");
const statusCodeConstants_1 = require("../../configs/statusCodeConstants");
const errorCodeConstants_1 = require("../../configs/errorCodeConstants");
const OptionModel_1 = __importDefault(require("../../models/OptionModel"));
const SharedConfig_1 = __importDefault(require("../../libs/SharedConfig"));
const common_1 = require("../../common");
const MaintenanceException_1 = __importDefault(require("../../exceptions/MaintenanceException"));
const AuthenticationException_1 = __importDefault(require("../../exceptions/AuthenticationException"));
class BaseController extends Sender_1.default {
    constructor(req, res, next) {
        super(req, res, next);
    }
    error404() {
        const error = new AllError_1.default('Route method not found');
        error.status = statusCodeConstants_1.NOTFOUND;
        throw error;
    }
    async initConstruct() {
        SharedConfig_1.default.set('controller', this);
        SharedConfig_1.default.set('user', (0, common_1.getUser)(this.req));
        SharedConfig_1.default.set('response', this.res);
        SharedConfig_1.default.set('request', this.req);
        SharedConfig_1.default.set(process.env);
        const options = await OptionModel_1.default.find().exec();
        for (const option of options) {
            SharedConfig_1.default.set(option.name, option.value);
        }
        if (this.isPrivateRoute) {
            switch (this.isPrivateRoute) {
                case constants_1.AuthenticationLevel.END_USER:
                    {
                        await this.ownerAndAdminAccess(SharedConfig_1.default.get('user')?._id);
                    }
                    break;
                case constants_1.AuthenticationLevel.ADMIN:
                    {
                        await this.adminAccess();
                    }
                    break;
                case constants_1.AuthenticationLevel.DEVELOPER:
                    {
                        await this.developerAccess();
                    }
                    break;
                default:
                    throw new AuthenticationException_1.default(this);
                    break;
            }
        }
        //if (this.isPrivateRoute) {
        //Access to option are allowed even if site is under maintenance
        if (this.executingClassName !== 'Option') {
            const developers = await this.developerAccess(false);
            const admins = await this.adminAccess(false);
            //Blocks everyone except developers from accessing the api
            if (!developers && SharedConfig_1.default.get('SERVER_MAINTENANCE')) {
                throw new MaintenanceException_1.default(this);
            }
            //Allows only admins and developers access the api
            if (!admins && SharedConfig_1.default.get('BLOCK_ALL_USERS')) {
                throw new MaintenanceException_1.default(this);
            }
            //Blocks all admins from accessing the api
            if (!developers && admins && SharedConfig_1.default.get('BLOCK_ALL_ADMIN')) {
                throw new MaintenanceException_1.default(this);
            }
        }
        //}
    }
    adminAccess(throwException = true) {
        const user = this?.user;
        if (!user || (user.role !== constants_1.AuthenticationLevel.DEVELOPER && user.role !== constants_1.AuthenticationLevel.ADMIN)) {
            if (throwException) {
                this.statusCode(statusCodeConstants_1.BAD_AUTHORIZATION).errorCode(errorCodeConstants_1.OUT_OF_BOUNDARY).error('Out of Boundary').send();
            }
            return null;
        }
        return user;
    }
    developerAccess(throwException = true) {
        const user = this?.user;
        if (!user || user.role !== constants_1.AuthenticationLevel.DEVELOPER) {
            if (throwException) {
                this.statusCode(statusCodeConstants_1.BAD_AUTHORIZATION).errorCode(errorCodeConstants_1.OUT_OF_BOUNDARY).error('Out of Boundary').send();
            }
            return null;
        }
        return user;
    }
    ownerAccess(uid, throwException = true) {
        if (this?.user?._id == uid) {
            return true;
        }
        else {
            if (throwException) {
                this.errorCode(errorCodeConstants_1.OUT_OF_BOUNDARY)
                    .statusCode(statusCodeConstants_1.BAD_AUTHORIZATION)
                    .error("You don't have access to this resource")
                    .send();
            }
        }
        return false;
    }
    async ownerAndAdminAccess(uid, throwException = true) {
        if (this.cronJobAccess) {
            return true;
        }
        const adminAccess = await this.adminAccess(false);
        if (adminAccess || this?.user?._id == uid) {
            return true;
        }
        else {
            if (throwException) {
                this.errorCode(errorCodeConstants_1.OUT_OF_BOUNDARY)
                    .statusCode(statusCodeConstants_1.BAD_AUTHORIZATION)
                    .error("You don't have access to this resource")
                    .send();
            }
        }
        return false;
    }
    checkZeroAmount(amount, throwException = true) {
        if (!amount || amount <= 0) {
            if (throwException)
                this.status(false)
                    .statusCode(statusCodeConstants_1.BAD_REQUEST)
                    .errorCode(errorCodeConstants_1.INVALID_AMOUNT)
                    .message("Amount can't be less than 0")
                    .send();
            else
                return false;
        }
        return amount;
    }
    isValidTransactionType(type, throwException = true) {
        switch (type) {
            case constants_1.TransactionType.DEPOSIT:
            case constants_1.TransactionType.WITHDRAW:
                break;
            default:
                if (throwException)
                    this.status(false)
                        .statusCode(statusCodeConstants_1.BAD_REQUEST)
                        .errorCode(errorCodeConstants_1.INVALID_AMOUNT)
                        .message('Invalid transaction type')
                        .send();
                else
                    return false;
                break;
        }
        return type;
    }
    checkMinMaxDepositAmount(amount, throwException = true) {
        this.checkZeroAmount(amount);
        const minAmountDeposit = SharedConfig_1.default.get(constants_1.MINIMUM_DEPOSIT_AMOUNT) || 1000;
        const maxAmountDeposit = SharedConfig_1.default.get(constants_1.MAXIMUM_DEPOSIT_AMOUNT) || 4999999;
        if (amount < minAmountDeposit || amount < maxAmountDeposit) {
            if (throwException)
                this.status(false)
                    .statusCode(statusCodeConstants_1.BAD_REQUEST)
                    .errorCode(errorCodeConstants_1.INVALID_AMOUNT)
                    .message(`Amount can't be less than ${minAmountDeposit} or greater than ${maxAmountDeposit}`)
                    .send();
            else
                return false;
        }
        return amount;
    }
    async isValidUser(uid, throwException = true) {
        const user = await UserModel_1.default.findById(uid).exec();
        if (user) {
            return user;
        }
        else {
            if (throwException) {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST).errorCode(errorCodeConstants_1.USER_NOTFOUND).error('User does not exist').send();
            }
        }
        return null;
    }
    async isValidUserPin(uid, pin, throwException = true) {
        const user = await UserModel_1.default.findOne({ _id: uid, pin }).exec();
        if (pin && `${pin}`.trim() !== '' && user) {
            return user;
        }
        else {
            if (throwException) {
                this.statusCode(statusCodeConstants_1.BAD_REQUEST)
                    .errorCode(errorCodeConstants_1.INCORRECT_TRANSACTION_PIN)
                    .error('Incorrect pin OR Create transaction pin in Setting > Change Pin')
                    .send();
            }
        }
        return null;
    }
    async like({ model, id }) {
        const found = (await model
            .findById(`${id}`)
            .exec());
        if (!found)
            this.status(false)
                .statusCode(statusCodeConstants_1.NOTFOUND)
                .message(model.modelName + ' not found')
                .send();
        else {
            let liked = false;
            if (found.likeByIds?.includes(this.user._id)) {
                found.likeByIds = found.likeByIds.filter((likedById) => likedById != this.user._id);
            }
            else {
                found.likeByIds.push(this.user._id);
                liked = true;
            }
            await found.save();
            this.status(true)
                .statusCode(statusCodeConstants_1.GET_SUCCESS)
                .setData({ [model.modelName]: found, liked: liked })
                .message(liked ? 'Liked' : 'Unliked')
                .send();
        }
    }
}
exports.default = BaseController;
