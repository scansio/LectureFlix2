import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import UserModel from '../models/UserModel'

class Misc extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async topGainer() {
    const topGainer = await UserModel.findOne().sort({ currentMonthProfit: 'descending' }).exec()
    this.success('Top Gainer of the Month').setData(topGainer).send()
  }
}

export default Misc
