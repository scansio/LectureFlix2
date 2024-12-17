/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import CountrieModel from '../models/CountrieModel'
import IUser from '../types/IUser'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'
import ICountrie from '../types/ICountrie'

class Countrie extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any): Promise<void> {
    const countrie = await CountrieModel.findOne({ id }).exec()
    if (!countrie) this.status(false).statusCode(NOTFOUND).message('Countrie not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(countrie).send()
  }

  async all() {
    const countries = await new PaginatingModel<ICountrie>(CountrieModel, this).makePublic(true).exec()
    if (!countries) this.status(false).statusCode(NOTFOUND).message('Countries not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(countries).send()
  }

  async create(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj)
    const created = await CountrieModel.create(definedValues)
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Countrie').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Countrie created').setData(created).send()
  }

  async update(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj)
    const updated = await CountrieModel.findByIdAndUpdate(obj?.id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Countrie failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Countrie updated').setData(updated).send()
  }

  async delete({ id }: any): Promise<void> {
    const deleted = await CountrieModel.findOneAndDelete({ id }).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Countrie failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Countrie deleted').setData(deleted).send()
  }
}

export default Countrie
