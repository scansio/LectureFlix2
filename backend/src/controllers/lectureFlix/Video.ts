/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import VideoModel from '../../models/lectureFlix/VideoModel'
import PaginatingModel from '../../models/PaginatingModel'
import IVideo from '../../types/lectureFlix/IVideo'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Video extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await VideoModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Video not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Videos = await new PaginatingModel<IVideo>(VideoModel, this).makePublic(true).exec()
    if (!Videos) this.status(false).statusCode(NOTFOUND).message('No Videos').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Videos).send()
  }

  async create({ course_id, video_title, video_description, upload_date, video_access }: any) {
    const created = await VideoModel.create({
      course_id,
      video_title,
      video_description,
      upload_date,
      video_access,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Video').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Video created').setData(created).send()
  }

  async update({ id, course_id, video_title, video_description, upload_date, video_access, status }: any) {
    const definedValues = getDefinedValuesFrom({
      course_id,
      video_title,
      video_description,
      upload_date,
      video_access,
      status,
    })
    const updated = await VideoModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Video failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Video updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await VideoModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Video failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Video deleted').setData(deleted).send()
  }
}

export default Video
