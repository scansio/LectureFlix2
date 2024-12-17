/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import AssessmentResultsModel from '../../models/lectureFlix/AssessmentResultsModel'
import PaginatingModel from '../../models/PaginatingModel'
import IAssessmentResults from '../../types/lectureFlix/IAssessmentResults'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class AssessmentResults extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await AssessmentResultsModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('AssessmentResults not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const AssessmentResultss = await new PaginatingModel<IAssessmentResults>(AssessmentResultsModel, this)
      .makePublic(true)
      .exec()
    if (!AssessmentResultss) this.status(false).statusCode(NOTFOUND).message('No AssessmentResultss').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(AssessmentResultss).send()
  }

  async create({ user_id, course_id, assessment_score }: any) {
    const created = await AssessmentResultsModel.create({
      user_id,
      course_id,
      assessment_score,
      assessment_date: new Date(),
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating AssessmentResults').send()
    else this.status(true).statusCode(POST_SUCCESS).message('AssessmentResults created').setData(created).send()
  }

  async update({ id, user_id, course_id, assessment_score, assessment_date, status }: any) {
    const definedValues = getDefinedValuesFrom({
      user_id,
      course_id,
      assessment_score,
      assessment_date,
      status,
    })
    const updated = await AssessmentResultsModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated)
      this.status(false).statusCode(BAD_REQUEST).message('AssessmentResults failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('AssessmentResults updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await AssessmentResultsModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('AssessmentResults failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('AssessmentResults deleted').setData(deleted).send()
  }
}

export default AssessmentResults
