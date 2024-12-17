import BaseController from '../../controllers/base/BaseController'
import AllError from './AllError'
import { BAD_REQUEST } from '../../configs/statusCodeConstants'
import IResStruct from '../../types/IResStruct'
import Sender from '../../controllers/base/Sender'

class RequestException extends AllError {
  sendSignal: IResStruct
  constructor(controller: BaseController | Sender, message?: string) {
    super()
    this.message = message || 'Request failed'
    this.controller = controller
    this.controller.status(false).statusCode(BAD_REQUEST).message(this.message)
    this.sendSignal = {
      connection: this.controller.getConnection(),
      data: this.controller.getData(),
    }
  }
}

export default RequestException
