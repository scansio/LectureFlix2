export interface FieldsAndValidators {
  [field: string]: any;
}

export type DataFrom = 'body' | 'param' | 'query' | 'header';
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
  | 'matches';

export type ValidatorOptions = {
  [k: string]: { message?: string } | string | undefined;
};

interface IPathValidators {
  [field: string]: FieldsAndValidators | boolean | ValidatorOptions;
}

export default IPathValidators;
