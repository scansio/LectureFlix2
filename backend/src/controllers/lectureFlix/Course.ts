
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import CourseModel from '../../models/lectureFlix/CourseModel'
import PaginatingModel from '../../models/PaginatingModel'
import ICourse from '../../types/lectureFlix/ICourse'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Course extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await CourseModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Course not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Courses = await new PaginatingModel<ICourse>(CourseModel, this).makePublic(true).exec()
    if (!Courses) this.status(false).statusCode(NOTFOUND).message('No Courses').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Courses).send()
  }

  async create({ course_name, lecturer_id, course_description }: any) {
    const created = await CourseModel.create({
      course_name,
      lecturer_id,
      course_description,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Course').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Course created').setData(created).send()
  }

  async update({ id, course_name, lecturer_id, course_description, status }: any) {
    const definedValues = getDefinedValuesFrom({
      course_name,
      lecturer_id,
      course_description,
      status,
    })
    const updated = await CourseModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Course failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Course updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await CourseModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Course failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Course deleted').setData(deleted).send()
  }
}

export default Course
