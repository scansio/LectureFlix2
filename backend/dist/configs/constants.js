"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_RIDE_PERCENTAGE_CHARGE_KEY = exports.TRANSFER = exports.WITHDRAW = exports.DEPOSIT = exports.GAIN_FETCHING_FREQUENCY = exports.ACCEPTANCE_FEE = exports.READ = exports.PERMANENT_DELETE = exports.LIMIT = exports.UNVERIFIED = exports.APPROVAL_DECLINE = exports.APPROVAL_DECLINED = exports.SUSPEND = exports.SUSPENDED = exports.PENDING_APPROVAL = exports.APPROVE = exports.APPROVED = exports.EXPERT = exports.ADVANCE = exports.BEGINNER = exports.EDIT = exports.UPDATE = exports.HOTLIST = exports.UNPUBLISH = exports.PUBLISH = exports.HOTLISTED = exports.PUBLISHED = exports.PENDING_PUBLISH = exports.INACTIVE = exports.ACTIVE = exports.USD = exports.NGN = exports.TEAM = exports.CREATOR = exports.C_UID = exports.A_UID = exports.UID = exports.DECADE = exports.YEAR = exports.MONTH = exports.WEEK = exports.DAY = exports.HOUR = exports.MINUTE = exports.MIN = exports.SECOND = exports.SEC = exports.MILLISECOND = exports.MILLIS = exports.SITE_TITLE = void 0;
exports.SocketAction = exports.PaystackHookEvent = exports.GeoJSONType = exports.TransactionMode = exports.TransactionType = exports.AuthenticationLevel = exports.SERVER_UPDATE_DATA_URL = exports.MIGRATE_DATA_URL = exports.EXPORT_DIRNAME = exports.LOCATION_RANGE = exports.LOCATION_RANGE_KEY = exports.WITHDRAWAL_DAY_DEFAULT = exports.WITHDRAWAL_DAY = exports.MAXIMUM_DEPOSIT_AMOUNT = exports.MINIMUM_DEPOSIT_AMOUNT = exports.TOTAL_TRADE_LIMIT = exports.REFERRAL_EARNING_TYPE_PLAN = exports.REFERRAL_EARNING_TYPE_TRADE = exports.ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT = exports.ALLOWED_WITHDRAWAL_PERCENTAGE_REFERRAL = exports.ALLOWED_WITHDRAWAL_PERCENTAGE_PROFIT = exports.TRADE_PROFIT_PERCENTAGE_FOR_SYSTEM = exports.WITHDRAW_MAX = exports.WITHDRAW_MIN = exports.DEPOSIT_MAX = exports.DEPOSIT_MIN = exports.NORMAL_RETURNED_RESULT_SET = exports.RESULT_SET_MAX = exports.CHARGE = exports.REFERRAL_RIDE_PERCENTAGE_CHARGE = exports.REFERRAL_RIDE_PERCENTAGE_CHARGE_KEY = exports.SYSTEM_RIDE_PERCENTAGE_CHARGE = void 0;
const md5_1 = __importDefault(require("../libs/md5"));
exports.SITE_TITLE = 'REACT STARTER';
exports.MILLIS = 1;
exports.MILLISECOND = 1;
exports.SEC = exports.MILLIS * 1000;
exports.SECOND = exports.MILLIS * 1000;
exports.MIN = exports.SECOND * 60;
exports.MINUTE = exports.SECOND * 60;
exports.HOUR = exports.MINUTE * 60;
exports.DAY = exports.HOUR * 24;
exports.WEEK = exports.DAY * 7;
exports.MONTH = 2_628_002_880;
exports.YEAR = 31_536_000_000;
exports.DECADE = 315_360_000_000;
exports.UID = (0, md5_1.default)('_user_09074395694');
exports.A_UID = (0, md5_1.default)('_admin_09074395694');
exports.C_UID = (0, md5_1.default)('_creator_09074395694');
exports.CREATOR = 4;
exports.TEAM = 5;
exports.NGN = '₦';
exports.USD = "<span><i class='fas fa-dollar'></i></span>";
exports.ACTIVE = 1;
exports.INACTIVE = 0;
exports.PENDING_PUBLISH = 0;
exports.PUBLISHED = exports.ACTIVE;
exports.HOTLISTED = 2;
exports.PUBLISH = exports.PUBLISHED;
exports.UNPUBLISH = exports.PENDING_PUBLISH;
exports.HOTLIST = exports.HOTLISTED;
exports.UPDATE = 7;
exports.EDIT = 8;
exports.BEGINNER = 1;
exports.ADVANCE = 2;
exports.EXPERT = 3;
exports.APPROVED = 1;
exports.APPROVE = exports.APPROVED;
exports.PENDING_APPROVAL = 3;
exports.SUSPENDED = 4;
exports.SUSPEND = exports.SUSPENDED;
exports.APPROVAL_DECLINED = 5;
exports.APPROVAL_DECLINE = exports.APPROVAL_DECLINED;
exports.UNVERIFIED = 0;
exports.LIMIT = 50;
exports.PERMANENT_DELETE = 6;
exports.READ = 9;
exports.ACCEPTANCE_FEE = 2.0;
exports.GAIN_FETCHING_FREQUENCY = 20000; //Millis
//Backend
exports.DEPOSIT = 'deposit';
exports.WITHDRAW = 'withdraw';
exports.TRANSFER = 'transfer';
exports.SYSTEM_RIDE_PERCENTAGE_CHARGE_KEY = 'SYSTEM_RIDE_PERCENTAGE_CHARGE_KEY';
exports.SYSTEM_RIDE_PERCENTAGE_CHARGE = 10;
exports.REFERRAL_RIDE_PERCENTAGE_CHARGE_KEY = 'REFERRAL_RIDE_PERCENTAGE_CHARGE_KEY';
exports.REFERRAL_RIDE_PERCENTAGE_CHARGE = 5;
exports.CHARGE = 'charge';
exports.RESULT_SET_MAX = 500;
exports.NORMAL_RETURNED_RESULT_SET = 10;
exports.DEPOSIT_MIN = 1.0e-10;
exports.DEPOSIT_MAX = 1000;
exports.WITHDRAW_MIN = 1.0e-10;
exports.WITHDRAW_MAX = 1000;
exports.TRADE_PROFIT_PERCENTAGE_FOR_SYSTEM = 5;
exports.ALLOWED_WITHDRAWAL_PERCENTAGE_PROFIT = 25;
exports.ALLOWED_WITHDRAWAL_PERCENTAGE_REFERRAL = 25;
exports.ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT = 25.0;
exports.REFERRAL_EARNING_TYPE_TRADE = 'trade';
exports.REFERRAL_EARNING_TYPE_PLAN = 'plan';
exports.TOTAL_TRADE_LIMIT = 'TOTAL_TRADE_LIMIT';
exports.MINIMUM_DEPOSIT_AMOUNT = 'MINIMUM_DEPOSIT_AMOUNT';
exports.MAXIMUM_DEPOSIT_AMOUNT = 'MAXIMUM_DEPOSIT_AMOUNT';
exports.WITHDRAWAL_DAY = 'WITHDRAWAL_DAY';
exports.WITHDRAWAL_DAY_DEFAULT = 'Monday';
exports.LOCATION_RANGE_KEY = 'LOCATION_RANGE';
exports.LOCATION_RANGE = 1000;
exports.EXPORT_DIRNAME = 'hotel-management-data-export';
exports.MIGRATE_DATA_URL = '/v1/migration';
exports.SERVER_UPDATE_DATA_URL = '/v1/migration/all';
var AuthenticationLevel;
(function (AuthenticationLevel) {
    AuthenticationLevel["END_USER"] = "END_USER";
    AuthenticationLevel["ADMIN"] = "ADMIN";
    AuthenticationLevel["DEVELOPER"] = "DEVELOPER";
})(AuthenticationLevel || (exports.AuthenticationLevel = AuthenticationLevel = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["DEPOSIT"] = "DEPOSIT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionMode;
(function (TransactionMode) {
    TransactionMode["PENDING"] = "PENDING";
    TransactionMode["REVERSED"] = "REVERSED";
    TransactionMode["SUCCESS"] = "SUCCESS";
    TransactionMode["FAILED"] = "FAILED";
})(TransactionMode || (exports.TransactionMode = TransactionMode = {}));
var GeoJSONType;
(function (GeoJSONType) {
    GeoJSONType["POINT"] = "Point";
    GeoJSONType["MULTIPOINT"] = "MultiPoint";
    GeoJSONType["POLYGON"] = "Polygon";
    GeoJSONType["MULTIPOLYGON"] = "MultiPolygon";
})(GeoJSONType || (exports.GeoJSONType = GeoJSONType = {}));
var PaystackHookEvent;
(function (PaystackHookEvent) {
    PaystackHookEvent["TRANSFER_SUCCESS"] = "transfer.success";
    PaystackHookEvent["TRANSFER_FAILED"] = "transfer.failed";
    PaystackHookEvent["TRANSFER_REVERSED"] = "transfer.reversed";
    PaystackHookEvent["PAYMENTREQUEST_PENDING"] = "paymentrequest.pending";
    PaystackHookEvent["PAYMENTREQUEST_SUCCESS"] = "paymentrequest.success";
    PaystackHookEvent["TRANSACTION_SUCCESS"] = "charge.success";
    PaystackHookEvent["CHARGE_DISPUTE_CREATE"] = "charge.dispute.create";
    PaystackHookEvent["CHARGE_DISPUTE_REMIND"] = "charge.dispute.remind";
    PaystackHookEvent["CHARGE_DISPUTE_RESOLVE"] = "charge.dispute.resolve";
})(PaystackHookEvent || (exports.PaystackHookEvent = PaystackHookEvent = {}));
var SocketAction;
(function (SocketAction) {
    SocketAction["AUTHENTICATION"] = "authentication";
    SocketAction["RIDE_LOCATION_UPDATE"] = "ride_location_update";
    SocketAction["BOOKEDRIDE_LOCATION_UPDATE"] = "bookedride_location_update";
    SocketAction["RIDE_LOCATION_UPDATE_RESPONSE"] = "ride_location_update_response";
    SocketAction["BOOKEDRIDE_LOCATION_UPDATE_RESPONSE"] = "bookedride_location_update_response";
    SocketAction["RIDE_LOCATION_BROADCAST"] = "ride_location_broadcast";
    SocketAction["BOOKEDRIDE_LOCATION_BROADCAST"] = "bookedride_location_broadcast";
    SocketAction["ONLINE_STATUS"] = "online_status";
    SocketAction["MESSAGE"] = "message";
    SocketAction["MESSAGE_RECIEVE"] = "message_recieve";
    SocketAction["MESSAGE_EDIT"] = "message_edit";
    SocketAction["MESSAGE_RECIEVE_EDIT"] = "message_recieve_edit";
    SocketAction["MESSAGE_STATUS"] = "message_status";
    SocketAction["INVALID_REQUEST"] = "invalid_request";
})(SocketAction || (exports.SocketAction = SocketAction = {}));
