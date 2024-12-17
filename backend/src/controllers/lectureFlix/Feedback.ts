/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import FeedbackModel from '../../models/lectureFlix/FeedbackModel'
import PaginatingModel from '../../models/PaginatingModel'
import IFeedback from '../../types/lectureFlix/IFeedback'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Feedback extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await FeedbackModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Feedback not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Feedbacks = await new PaginatingModel<IFeedback>(FeedbackModel, this).makePublic(true).exec()
    if (!Feedbacks) this.status(false).statusCode(NOTFOUND).message('No Feedbacks').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Feedbacks).send()
  }

  async create({ user_id, course_id, feedback_text, rating, submitted_at }: any) {
    const created = await FeedbackModel.create({
      user_id,
      course_id,
      feedback_text,
      rating,
      submitted_at,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Feedback').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Feedback created').setData(created).send()
  }

  async update({ id, user_id, course_id, feedback_text, rating, submitted_at, status }: any) {
    const definedValues = getDefinedValuesFrom({
      user_id,
      course_id,
      feedback_text,
      rating,
      submitted_at,
      status,
    })
    const updated = await FeedbackModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Feedback failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Feedback updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await FeedbackModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Feedback failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Feedback deleted').setData(deleted).send()
  }
}

export default Feedback
