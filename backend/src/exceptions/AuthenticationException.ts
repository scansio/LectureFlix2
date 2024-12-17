import { BAD_AUTHENTICATION } from '../configs/statusCodeConstants'
import BaseController from '../controllers/base/BaseController'
import Sender from '../controllers/base/Sender'
import RequestException from './base/RequestException'

class AuthenticationException extends RequestException {
  constructor(controller: BaseController | Sender, message?: string) {
    super(controller, message || 'Authentication Error')
    this.sendSignal.connection.statusCode = BAD_AUTHENTICATION
  }
}

export default AuthenticationException
