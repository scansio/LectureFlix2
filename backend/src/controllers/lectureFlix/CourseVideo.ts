/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import CourseVideoModel from '../../models/lectureFlix/CourseVideoModel'
import PaginatingModel from '../../models/PaginatingModel'
import ICourseVideo from '../../types/lectureFlix/ICourseVideo'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class CourseVideo extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await CourseVideoModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('CourseVideo not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const CourseVideos = await new PaginatingModel<ICourseVideo>(CourseVideoModel, this).makePublic(true).exec()
    if (!CourseVideos) this.status(false).statusCode(NOTFOUND).message('No CourseVideos').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(CourseVideos).send()
  }

  async create({ course_id, video_id }: any) {
    const created = await CourseVideoModel.create({
      course_id,
      video_id,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating CourseVideo').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseVideo created').setData(created).send()
  }

  async update({ id, course_id, video_id, status }: any) {
    const definedValues = getDefinedValuesFrom({
      course_id,
      video_id,
      status,
    })
    const updated = await CourseVideoModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('CourseVideo failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseVideo updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await CourseVideoModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('CourseVideo failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('CourseVideo deleted').setData(deleted).send()
  }
}

export default CourseVideo
