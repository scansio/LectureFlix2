import { ValidationChain, Validators as ExpressValidators, ExistsOptions } from 'express-validator/lib/chain'
import {
  ContainsOptions,
  IsAlphanumericOptions,
  IsAlphaOptions,
  IsBase64Options,
  IsBooleanOptions,
  IsDateOptions,
  IsDecimalOptions,
  IsEmailOptions,
  IsEmptyOptions,
  IsIntOptions,
  IsJSONOptions,
  IsMobilePhoneOptions,
  IsNumericOptions,
  IsStrongPasswordOptions,
  IsTimeOptions,
  IsURLOptions,
  MinMaxExtendedOptions,
  NormalizeEmailOptions,
} from 'express-validator/lib/options'

type Validators = ExpressValidators<ValidationChain>

export interface FieldsAndValidators {
  [field: string]: Validators
}

export type DataFrom = 'body' | 'param' | 'query' | 'header'
export type ValidatorsFunctionName =
  | 'not'
  | 'custom'
  | 'exists'
  | 'isArray'
  | 'isObject'
  | 'isString'
  | 'isULID'
  | 'notEmpty'
  | 'contains'
  | 'equals'
  | 'isAfter'
  | 'isAlpha'
  | 'isAlphanumeric'
  | 'isAscii'
  | 'isBase64'
  | 'isBefore'
  | 'isBoolean'
  | 'isBtcAddress'
  | 'isByteLength'
  | 'isDataURI'
  | 'isDate'
  | 'isDecimal'
  | 'isDivisibleBy'
  | 'isEmail'
  | 'isEmpty'
  | 'isEthereumAddress'
  | 'isFloat'
  | 'isHash'
  | 'isIP'
  | 'isIn'
  | 'isInt'
  | 'isJSON'
  | 'isJWT'
  | 'isLength'
  | 'isLowercase'
  | 'isMD5'
  | 'isMobilePhone'
  | 'isMongoId'
  | 'isNumeric'
  | 'isPort'
  | 'isPostalCode'
  | 'isSemVer'
  | 'isSlug'
  | 'isStrongPassword'
  | 'isTime'
  | 'isURL'
  | 'isUppercase'
  | 'matches'

export type ValidatorOptions = {
  [k: string]:
    | { message?: string }
    | ExistsOptions
    | MinMaxExtendedOptions
    | ContainsOptions
    | IsAlphaOptions
    | IsAlphanumericOptions
    | IsBase64Options
    | IsBooleanOptions
    | IsDateOptions
    | IsDecimalOptions
    | IsEmailOptions
    | IsEmptyOptions
    | IsIntOptions
    | IsJSONOptions
    | IsMobilePhoneOptions
    | IsNumericOptions
    | IsStrongPasswordOptions
    | IsURLOptions
    | IsTimeOptions
    | NormalizeEmailOptions
    | string
    | undefined
}

interface IPathValidators {
  [field: string]: FieldsAndValidators | Validators | boolean | ValidatorOptions
}

export { Validators as IValidators }
export default IPathValidators
