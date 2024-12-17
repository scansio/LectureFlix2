import Reblend from 'reblendjs'
import SharedConfig from '../scripts/SharedConfig'
import { Navigate } from 'reblend-router'

export default function Refresh(props) {
  const previousPage = SharedConfig.get('previousPage')

  return <Navigate to={previousPage || '/home'} />
}
