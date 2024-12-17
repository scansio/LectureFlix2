/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import LearnerModel from '../../models/lectureFlix/LearnerModel'
import PaginatingModel from '../../models/PaginatingModel'
import ILearner from '../../types/lectureFlix/ILearner'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Learner extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await LearnerModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Learner not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Learners = await new PaginatingModel<ILearner>(LearnerModel, this).makePublic(true).exec()
    if (!Learners) this.status(false).statusCode(NOTFOUND).message('No Learners').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Learners).send()
  }

  async create({ full_name, email, password, country, date_of_birth }: any) {
    const created = await LearnerModel.create({
      full_name,
      email,
      password,
      country,
      date_of_birth,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Learner').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Learner created').setData(created).send()
  }

  async update({ id, full_name, email, password, country, date_of_birth, status }: any) {
    const definedValues = getDefinedValuesFrom({
      full_name,
      email,
      password,
      country,
      date_of_birth,
      status,
    })
    const updated = await LearnerModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Learner failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Learner updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await LearnerModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Learner failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Learner deleted').setData(deleted).send()
  }
}

export default Learner
