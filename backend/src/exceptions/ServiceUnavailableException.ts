import { SERVICE_UNAVAILABLE } from '../configs/statusCodeConstants'
import BaseController from '../controllers/base/BaseController'
import RequestException from './base/RequestException'

class ServiceUnavailableException extends RequestException {
  constructor(controller: BaseController, message?: string) {
    super(controller, message || 'Service unavailable try again shortly')
    this.sendSignal.connection.statusCode = SERVICE_UNAVAILABLE
  }
}

export default ServiceUnavailableException
