/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import VideoCommentModel from '../../models/lectureFlix/VideoCommentModel'
import PaginatingModel from '../../models/PaginatingModel'
import IVideoComment from '../../types/lectureFlix/IVideoComment'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class VideoComment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await VideoCommentModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('VideoComment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const VideoComments = await new PaginatingModel<IVideoComment>(VideoCommentModel, this).makePublic(true).exec()
    if (!VideoComments) this.status(false).statusCode(NOTFOUND).message('No VideoComments').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(VideoComments).send()
  }

  async create({ video_id, comment_text }: any) {
    const created = await VideoCommentModel.create({
      video_id,
      comment_text,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating VideoComment').send()
    else this.status(true).statusCode(POST_SUCCESS).message('VideoComment created').setData(created).send()
  }

  async update({ id, video_id, comment_text, status }: any) {
    const definedValues = getDefinedValuesFrom({
      video_id,
      comment_text,
      status,
    })
    const updated = await VideoCommentModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated)
      this.status(false).statusCode(BAD_REQUEST).message('VideoComment failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('VideoComment updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await VideoCommentModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('VideoComment failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('VideoComment deleted').setData(deleted).send()
  }
}

export default VideoComment
