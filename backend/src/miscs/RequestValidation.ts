import { Handler, NextFunction, Request, Response, Router } from 'express'
import { ExpressValidator } from 'express-validator'
import IValidation from '../routes/interfaces/IValidation'
import IPathValidators, {
  DataFrom,
  ValidatorOptions,
  ValidatorsFunctionName,
} from '../routes/interfaces/IPathValidators'
import { RequestMethods } from '../routes/RequestMethods'

export default class RequestValidation {
  private validationErrorHandler = (req: Request, _res: Response, next: NextFunction) => {
    const result = this.dataValidator.validationResult(req)
    const errors = result
      .array()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((error) => `${(error as any).path}: ${error.msg}\n`)
      .join('')

    if (errors) {
      next(new Error(errors))
    } else {
      next()
    }
  }
  private dataValidator = new ExpressValidator()
  private validationMiddlewares: Handler[]

  constructor(validation?: IValidation) {
    this.validationErrorHandler = this.validationErrorHandler.bind(this)

    this.validationMiddlewares = []

    if (validation) {
      for (const [dataFrom, parameters] of Object.entries(validation)) {
        const val = (validatorsOrParameters: IPathValidators, fields: string[]) => {
          for (const [validatorOrParameterName, validatorOptionOrParameterValue] of Object.entries(
            validatorsOrParameters,
          )) {
            const message = (validatorOptionOrParameterValue as ValidatorOptions).message
            const isValidator = this.dataValidator[dataFrom as DataFrom](fields.join('.'), message)[
              validatorOrParameterName as ValidatorsFunctionName
            ]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (isValidator as any) {
              //Remove message from option if its they
              delete (validatorOptionOrParameterValue as ValidatorOptions)?.message
              this.validationMiddlewares.push(isValidator(validatorOptionOrParameterValue))
            } else {
              val(validatorOptionOrParameterValue as IPathValidators, [...fields, validatorOrParameterName])
            }
          }
        }

        for (const [parameter, valOrParams] of Object.entries(parameters as { [field: string]: IPathValidators })) {
          val(valOrParams, [parameter])
        }
      }
    }
  }

  wrap(app: Router, middleware: Handler, method: RequestMethods, endpoint: string) {
    app![method](endpoint, ...this.validationMiddlewares, this.validationErrorHandler, middleware)
  }
}
