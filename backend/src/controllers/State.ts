/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import StateModel from '../models/StateModel'
import IUser from '../types/IUser'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import PaginatingModel from '../models/PaginatingModel'
import { getDefinedValuesFrom } from '../common'
import IState from '../types/IState'

class State extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any): Promise<void> {
    const state = await StateModel.findOne({ id }).exec()
    if (!state) this.status(false).statusCode(NOTFOUND).message('State not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(state).send()
  }

  async all() {
    const states = await new PaginatingModel<IState>(StateModel, this).makePublic(true).exec()
    if (!states) this.status(false).statusCode(NOTFOUND).message('States not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(states).send()
  }

  async create(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj)
    const created = await StateModel.create(definedValues)
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating State').send()
    else this.status(true).statusCode(POST_SUCCESS).message('State created').setData(created).send()
  }

  async update(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj)
    const updated = await StateModel.findByIdAndUpdate(obj?.id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('State failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('State updated').setData(updated).send()
  }

  async delete({ id }: any): Promise<void> {
    const deleted = await StateModel.findOneAndDelete({ id }).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('State failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('State deleted').setData(deleted).send()
  }
}

export default State
