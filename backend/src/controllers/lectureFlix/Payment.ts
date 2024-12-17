/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import PaymentModel from '../../models/lectureFlix/PaymentModel'
import PaginatingModel from '../../models/PaginatingModel'
import IPayment from '../../types/lectureFlix/IPayment'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Payment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await PaymentModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Payment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Payments = await new PaginatingModel<IPayment>(PaymentModel, this).makePublic(true).exec()
    if (!Payments) this.status(false).statusCode(NOTFOUND).message('No Payments').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Payments).send()
  }

  async create({ learner_id, amount, payment_method }: any) {
    const created = await PaymentModel.create({
      learner_id,
      amount,
      payment_method,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Payment').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Payment created').setData(created).send()
  }

  async update({ id, learner_id, amount, payment_method, status }: any) {
    const definedValues = getDefinedValuesFrom({
      learner_id,
      amount,
      payment_method,
      status,
    })
    const updated = await PaymentModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated) this.status(false).statusCode(BAD_REQUEST).message('Payment failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Payment updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await PaymentModel.findByIdAndDelete(id).exec()
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Payment failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Payment deleted').setData(deleted).send()
  }
}

export default Payment
