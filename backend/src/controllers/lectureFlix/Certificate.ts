/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import CertificateModel from '../../models/lectureFlix/CertificateModel'
import PaginatingModel from '../../models/PaginatingModel'
import ICertificate from '../../types/lectureFlix/ICertificate'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Certificate extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await CertificateModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Certificate not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Certificates = await new PaginatingModel<ICertificate>(CertificateModel, this).makePublic(true).exec()
    if (!Certificates) this.status(false).statusCode(NOTFOUND).message('No Certificates').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Certificates).send()
  }

  async create({ user_id, course_id, certificate_number }: any) {
    const created = await CertificateModel.create({
      user_id,
      course_id,
      certificate_number,
      issued_date: new Date(),
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Certificate').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Certificate created').setData(created).send()
  }

  async update({ id, user_id, course_id, certificate_number, issued_date, status }: any) {
    const definedValues = getDefinedValuesFrom({
      user_id,
      course_id,
      certificate_number,
      issued_date,
      status,
    })
    const updated = await CertificateModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Certificate failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Certificate updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await CertificateModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('Certificate failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Certificate deleted').setData(deleted).send()
  }
}

export default Certificate
