import { NOTFOUND } from '../configs/statusCodeConstants'
import BaseController from '../controllers/base/BaseController'
import Sender from '../controllers/base/Sender'
import RequestException from './base/RequestException'

class NotFoundException extends RequestException {
  constructor(controller: BaseController | Sender, message?: string) {
    super(controller, message || 'Not found')
    this.sendSignal.connection.statusCode = NOTFOUND
  }
}

export default NotFoundException
