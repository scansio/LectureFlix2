/* eslint-disable no-new */
import Reblend, { useEffect, useRef, useState } from 'reblendjs'
import Footer from '../layout/Footer'
import Sidebar from '../layout/Sidebar'
import NavToggler from './layout_components/NavToggler'
import ThemeToggler from './layout_components/ThemeToggler'
import Cookie from '../scripts/Cookie'
import { theme } from '../components/context/theme'
import { ToastContainer } from 'react-toastify'
import SharedConfig from '../scripts/SharedConfig'
import { Navigate } from 'reblend-router'

function Main(props) {
  /*   const history = useHistory();
   */ const [refresh, setRefresh] = useState(false)

  let activeTheme = Cookie.has('theme')
  if (!activeTheme) {
    new Cookie('theme', 'light')
    activeTheme = 'light'
  }
  const [styles, setStyle] = useState(theme[activeTheme])
  //  let [image, setImage] = useState(sidebarImage);
  const mainPanel = useRef()
  // const [hasImage, setHasImage] = useState(true);

  const toggleTheme = () => {
    activeTheme = activeTheme === 'dark' ? 'light' : activeTheme === 'light' ? 'dark' : 'light'
    setStyle(theme[activeTheme])
    Cookie.replace('theme', activeTheme)
  }

  useEffect(() => {
    const savedPathname = () => {
      const pathname = window.location.pathname
      if (!pathname.includes('refresh')) {
        SharedConfig.set('previousPage', pathname)
      }
      return pathname
    }
    return savedPathname
  }, [])

  useEffect(
    () => {
      setRefresh(false)

      const handleKeyPress = (event) => {
        if (event.key === 'F5') {
          event.preventDefault() // Prevent the default F5 behavior
          setRefresh(true)
        }
      }

      window.addEventListener('keydown', handleKeyPress)

      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      }
    },
    [
      /* history */
    ],
  )

  if (refresh) {
    ;<Navigate to="/refresh" />
  }

  return (
    <div style={styles}>
      <div className="layout-wrapper layout-content-navbar" style={{ backgroundColor: styles.backgroundColor }}>
        <div className="layout-container">
          <Sidebar />
          <div className="layout-page" ref={mainPanel}>
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y mb-5">
                <ToastContainer newestOnTop={true} toastStyle={{ borderRadius: 20, padding: 5 }} />
                {props.children}
              </div>
              <Footer>
                <ThemeToggler
                  toggleTheme={() => {
                    toggleTheme()
                  }}
                />
              </Footer>
              <div className="content-backdrop fade"></div>
            </div>
          </div>
        </div>
        <NavToggler>
          <div className="layout-overlay layout-menu-toggle"></div>
        </NavToggler>
      </div>
    </div>
  )
}

export default Main
