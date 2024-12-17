"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class RequestValidation {
    validationErrorHandler = (req, _res, next) => {
        const result = this.dataValidator.validationResult(req);
        const errors = result
            .array()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((error) => `${error.path}: ${error.msg}\n`)
            .join('');
        if (errors) {
            next(new Error(errors));
        }
        else {
            next();
        }
    };
    dataValidator = new express_validator_1.ExpressValidator();
    validationMiddlewares;
    constructor(validation) {
        this.validationErrorHandler = this.validationErrorHandler.bind(this);
        this.validationMiddlewares = [];
        if (validation) {
            for (const [dataFrom, parameters] of Object.entries(validation)) {
                const val = (validatorsOrParameters, fields) => {
                    for (const [validatorOrParameterName, validatorOptionOrParameterValue] of Object.entries(validatorsOrParameters)) {
                        const message = validatorOptionOrParameterValue.message;
                        const isValidator = this.dataValidator[dataFrom](fields.join('.'), message)[validatorOrParameterName];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (isValidator) {
                            //Remove message from option if its they
                            delete validatorOptionOrParameterValue?.message;
                            this.validationMiddlewares.push(isValidator(validatorOptionOrParameterValue));
                        }
                        else {
                            val(validatorOptionOrParameterValue, [...fields, validatorOrParameterName]);
                        }
                    }
                };
                for (const [parameter, valOrParams] of Object.entries(parameters)) {
                    val(valOrParams, [parameter]);
                }
            }
        }
    }
    wrap(app, middleware, method, endpoint) {
        app[method](endpoint, ...this.validationMiddlewares, this.validationErrorHandler, middleware);
    }
}
exports.default = RequestValidation;
