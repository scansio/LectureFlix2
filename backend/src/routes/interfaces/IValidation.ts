import IPathValidators from './IPathValidators'

export default interface IValidation {
  header?: IPathValidators
  body?: IPathValidators
  param?: IPathValidators
  query?: IPathValidators
}
