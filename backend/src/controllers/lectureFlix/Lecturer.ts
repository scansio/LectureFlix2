/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import LecturerModel from '../../models/lectureFlix/LecturerModel'
import PaginatingModel from '../../models/PaginatingModel'
import ILecturer from '../../types/lectureFlix/ILecturer'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Lecturer extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await LecturerModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Lecturer not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Lecturers = await new PaginatingModel<ILecturer>(LecturerModel, this).makePublic(true).exec()
    if (!Lecturers) this.status(false).statusCode(NOTFOUND).message('No Lecturers').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Lecturers).send()
  }

  async create({ full_name, email, expertise, university_id }: any) {
    const created = await LecturerModel.create({
      full_name,
      email,
      expertise,
      university_id,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Lecturer').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Lecturer created').setData(created).send()
  }

  async update({ id, full_name, email, expertise, university_id, status }: any) {
    const definedValues = getDefinedValuesFrom({
      full_name,
      email,
      expertise,
      university_id,
      status,
    })
    const updated = await LecturerModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Lecturer failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Lecturer updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await LecturerModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Lecturer failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Lecturer deleted').setData(deleted).send()
  }
}

export default Lecturer
