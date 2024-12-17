import { config } from 'dotenv'
import { APIVersionStatus } from '../../APIVersionStatus'
import IAPIVersionInfo from '../../interfaces/IAPIVersionInfo'
import { AuthenticationLevel } from '../../../configs/constants'

const info: IAPIVersionInfo = {
  title: 'LectureFlix API Endpoints',
  description: 'A combo of Netflix and YouTube',
  version: 'v1',
  servers: ['/main'],
  status: APIVersionStatus.ENABLED,
  miscModel: {
    AuthenticationLevel,
  },
}

export default info
