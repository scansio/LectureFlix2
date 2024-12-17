/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOTFOUND } from '../../configs/statusCodeConstants'
import SubscriptionModel from '../../models/lectureFlix/SubscriptionModel'
import PaginatingModel from '../../models/PaginatingModel'
import ISubscription from '../../types/lectureFlix/ISubscription'
import IUser from '../../types/IUser'
import BaseController from '../base/BaseController'

class Subscription extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await SubscriptionModel.findById(`${id}`).exec()
    if (!found) this.status(false).statusCode(NOTFOUND).message('Subscription not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Subscriptions = await new PaginatingModel<ISubscription>(SubscriptionModel, this).makePublic(true).exec()
    if (!Subscriptions) this.status(false).statusCode(NOTFOUND).message('No Subscriptions').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Subscriptions).send()
  }

  async create({ learner_id, subscription_type, start_date, end_date }: any) {
    const created = await SubscriptionModel.create({
      learner_id,
      subscription_type,
      start_date,
      end_date,
    })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Subscription').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Subscription created').setData(created).send()
  }

  async update({ id, learner_id, subscription_type, start_date, end_date, status }: any) {
    const definedValues = getDefinedValuesFrom({
      learner_id,
      subscription_type,
      start_date,
      end_date,
      status,
    })
    const updated = await SubscriptionModel.findByIdAndUpdate(id, definedValues, {
      new: true,
    }).exec()
    if (!updated)
      this.status(false).statusCode(BAD_REQUEST).message('Subscription failed to update due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Subscription updated').setData(updated).send()
  }

  async delete({ id }: any) {
    const deleted = await SubscriptionModel.findByIdAndDelete(id).exec()
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('Subscription failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Subscription deleted').setData(deleted).send()
  }
}

export default Subscription
