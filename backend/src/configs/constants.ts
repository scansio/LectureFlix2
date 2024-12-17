import md5 from '../libs/md5'

export const SITE_TITLE = 'REACT STARTER'
export const MILLIS = 1
export const MILLISECOND = 1
export const SEC = MILLIS * 1000
export const SECOND = MILLIS * 1000
export const MIN = SECOND * 60
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7
export const MONTH = 2_628_002_880
export const YEAR = 31_536_000_000
export const DECADE = 315_360_000_000
export const UID = md5('_user_09074395694')
export const A_UID = md5('_admin_09074395694')
export const C_UID = md5('_creator_09074395694')
export const CREATOR = 4
export const TEAM = 5
export const NGN = '₦'
export const USD = "<span><i class='fas fa-dollar'></i></span>"
export const ACTIVE = 1
export const INACTIVE = 0
export const PENDING_PUBLISH = 0
export const PUBLISHED = ACTIVE
export const HOTLISTED = 2
export const PUBLISH = PUBLISHED
export const UNPUBLISH = PENDING_PUBLISH
export const HOTLIST = HOTLISTED
export const UPDATE = 7
export const EDIT = 8
export const BEGINNER = 1
export const ADVANCE = 2
export const EXPERT = 3
export const APPROVED = 1
export const APPROVE = APPROVED
export const PENDING_APPROVAL = 3
export const SUSPENDED = 4
export const SUSPEND = SUSPENDED
export const APPROVAL_DECLINED = 5
export const APPROVAL_DECLINE = APPROVAL_DECLINED
export const UNVERIFIED = 0
export const LIMIT = 50
export const PERMANENT_DELETE = 6
export const READ = 9
export const ACCEPTANCE_FEE = 2.0
export const GAIN_FETCHING_FREQUENCY = 20000 //Millis

//Backend
export const DEPOSIT = 'deposit'
export const WITHDRAW = 'withdraw'
export const TRANSFER = 'transfer'
export const SYSTEM_RIDE_PERCENTAGE_CHARGE_KEY = 'SYSTEM_RIDE_PERCENTAGE_CHARGE_KEY'
export const SYSTEM_RIDE_PERCENTAGE_CHARGE = 10
export const REFERRAL_RIDE_PERCENTAGE_CHARGE_KEY = 'REFERRAL_RIDE_PERCENTAGE_CHARGE_KEY'
export const REFERRAL_RIDE_PERCENTAGE_CHARGE = 5
export const CHARGE = 'charge'
export const RESULT_SET_MAX = 500
export const NORMAL_RETURNED_RESULT_SET = 10
export const DEPOSIT_MIN = 1.0e-10
export const DEPOSIT_MAX = 1000
export const WITHDRAW_MIN = 1.0e-10
export const WITHDRAW_MAX = 1000
export const TRADE_PROFIT_PERCENTAGE_FOR_SYSTEM = 5
export const ALLOWED_WITHDRAWAL_PERCENTAGE_PROFIT = 25
export const ALLOWED_WITHDRAWAL_PERCENTAGE_REFERRAL = 25
export const ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT = 25.0
export const REFERRAL_EARNING_TYPE_TRADE = 'trade'
export const REFERRAL_EARNING_TYPE_PLAN = 'plan'
export const TOTAL_TRADE_LIMIT = 'TOTAL_TRADE_LIMIT'
export const MINIMUM_DEPOSIT_AMOUNT = 'MINIMUM_DEPOSIT_AMOUNT'
export const MAXIMUM_DEPOSIT_AMOUNT = 'MAXIMUM_DEPOSIT_AMOUNT'
export const WITHDRAWAL_DAY = 'WITHDRAWAL_DAY'
export const WITHDRAWAL_DAY_DEFAULT = 'Monday'
export const LOCATION_RANGE_KEY = 'LOCATION_RANGE'
export const LOCATION_RANGE = 1000

export const EXPORT_DIRNAME = 'hotel-management-data-export'
export const MIGRATE_DATA_URL = '/v1/migration'
export const SERVER_UPDATE_DATA_URL = '/v1/migration/all'

export enum AuthenticationLevel {
  END_USER = 'END_USER',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export enum TransactionType {
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
}
export enum TransactionMode {
  PENDING = 'PENDING',
  REVERSED = 'REVERSED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum GeoJSONType {
  POINT = 'Point',
  MULTIPOINT = 'MultiPoint',
  POLYGON = 'Polygon',
  MULTIPOLYGON = 'MultiPolygon',
}

export enum PaystackHookEvent {
  TRANSFER_SUCCESS = 'transfer.success',
  TRANSFER_FAILED = 'transfer.failed',
  TRANSFER_REVERSED = 'transfer.reversed',
  PAYMENTREQUEST_PENDING = 'paymentrequest.pending',
  PAYMENTREQUEST_SUCCESS = 'paymentrequest.success',
  TRANSACTION_SUCCESS = 'charge.success',
  CHARGE_DISPUTE_CREATE = 'charge.dispute.create',
  CHARGE_DISPUTE_REMIND = 'charge.dispute.remind',
  CHARGE_DISPUTE_RESOLVE = 'charge.dispute.resolve',
}

export enum SocketAction {
  AUTHENTICATION = 'authentication',
  RIDE_LOCATION_UPDATE = 'ride_location_update',
  BOOKEDRIDE_LOCATION_UPDATE = 'bookedride_location_update',
  RIDE_LOCATION_UPDATE_RESPONSE = 'ride_location_update_response',
  BOOKEDRIDE_LOCATION_UPDATE_RESPONSE = 'bookedride_location_update_response',
  RIDE_LOCATION_BROADCAST = 'ride_location_broadcast',
  BOOKEDRIDE_LOCATION_BROADCAST = 'bookedride_location_broadcast',
  ONLINE_STATUS = 'online_status',
  MESSAGE = 'message',
  MESSAGE_RECIEVE = 'message_recieve',
  MESSAGE_EDIT = 'message_edit',
  MESSAGE_RECIEVE_EDIT = 'message_recieve_edit',
  MESSAGE_STATUS = 'message_status',
  INVALID_REQUEST = 'invalid_request',
}
