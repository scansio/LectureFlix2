/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import OptionModel from '../models/OptionModel'
import IOption from '../types/IOption'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS, SERVICE_UNAVAILABLE } from '../configs/statusCodeConstants'
import { OPTION_NOTFOUND, UNABLE_TO_COMPLETE_REQUEST } from '../configs/errorCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'

class Option extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init() {
    return true
  }

  async get({ name }: any) {
    const option: IOption | null = await OptionModel.findOne({
      name,
    }).exec()
    if (!option) {
      this.statusCode(SERVICE_UNAVAILABLE).errorCode(OPTION_NOTFOUND).message(`${name} option not found`).send()
    } else {
      this.statusCode(GET_SUCCESS).message('Success').status(true).setData(option).send()
    }
  }

  async all() {
    const options = await new PaginatingModel<IOption>(OptionModel, this).exec()
    if (!options) this.status(false).statusCode(NOTFOUND).message('Options not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(options).send()
  }

  async create({ name, value, description, isPublic }: any) {
    isPublic === 1 && (isPublic = true)
    try {
      const created: IOption = await OptionModel.create({
        name,
        value,
        description,
        isPublic,
      })
      this.statusCode(POST_SUCCESS).message('Option created').status(true).setData(created)
    } catch (error) {
      this.statusCode(SERVICE_UNAVAILABLE)
        .errorCode(UNABLE_TO_COMPLETE_REQUEST)
        .message((error as Error).message)
    }
    this.send()
  }

  async update({ id, name, value, description, isPublic }: any): Promise<void> {
    isPublic === 1 && (isPublic = true)
    const definedValues = getDefinedValuesFrom({
      name,
      value,
      description,
      isPublic,
    })
    const updated = await OptionModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Option failed to update').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Option updated').setData(updated).send()
  }

  async delete({ id }: any): Promise<void> {
    const deleted = await OptionModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Option failed to be deleted').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Option deleted').setData(deleted).send()
  }

  async publics() {
    const options: IOption[] | null = await OptionModel.find({
      isPublic: true,
    }).exec()
    if (!options) {
      this.statusCode(SERVICE_UNAVAILABLE).errorCode(OPTION_NOTFOUND).message(`Public options not found`)
    } else {
      this.statusCode(GET_SUCCESS).message('Success').status(true).setData(options)
    }
    this.send()
  }
}

export default Option
