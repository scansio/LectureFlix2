/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import CourseProgressModel from '../../models/lectureFlix/CourseProgressModel'
import PaginatingModel from '../../models/PaginatingModel'
import ICourseProgress from '../../types/lectureFlix/ICourseProgress'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class CourseProgress extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await CourseProgressModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('CourseProgress not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const CourseProgresss = await new PaginatingModel<ICourseProgress>(CourseProgressModel, this).makePublic(true).exec()
    if (!CourseProgresss) this.status(false).statusCode(NOTFOUND).message('No CourseProgresss').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(CourseProgresss).send()
  }

  async create({ user_id, course_id, progress_percenCourseProgresse, progressStatus, last_updated }: any) {
    const created = await CourseProgressModel.create({
      user_id,
      course_id,
      progress_percenCourseProgresse,
      progressStatus,
      last_updated,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating CourseProgress').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseProgress created').setData(created).send()
  }

  async update({ id, user_id, course_id, progress_percenCourseProgresse, progressStatus, last_updated, status }: any) {
    const definedValues = getDefinedValuesFrom({
      user_id,
      course_id,
      progress_percenCourseProgresse,
      progressStatus,
      last_updated,
      status,
    })
    const updated = await CourseProgressModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('CourseProgress failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseProgress updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await CourseProgressModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('CourseProgress failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseProgress deleted').setData(deleted).send()
  }
}

export default CourseProgress
