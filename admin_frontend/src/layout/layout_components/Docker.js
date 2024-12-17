import Reblend from 'reblendjs'
import { useLocation } from 'reblend-router'
import { isActivePath as activeRoute } from '../../scripts/misc'
import dashboardRoutes from '../sidebarProp'
import DockerButton from './DockerButton'

function Docker({ ...props }) {
  const location = useLocation()
  return (
    <div
      className="btn-group btn-group-sm docker mt-2"
      style={{
        ...props?.style,
        overflowX: 'scroll',
        position: 'fixed',
        bottom: '0',
        width: '100%',
      }}
    >
      {dashboardRoutes?.map((prop) => {
        if (!prop.redirect) {
          return <DockerButton active={activeRoute(prop.path,location)} {...prop} key={prop.path} />
        } else return null
      })}
    </div>
  )
}

export default Docker
