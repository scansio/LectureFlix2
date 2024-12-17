import Reblend, { useContext, useEffect, useState } from "reblendjs";
import InfoContainer from "./components/InfoContainer";
import SchemaBlock from "./components/SchemaBlock";
import { IAPI, Version } from "./interfaces/IAPI";
import SVGDefinition from "./components/SVGDefinition";
import { versionContext, View, viewContext } from "./context";
import SideBarItems from "./components/SideBarItems";
import MainPane from "./components/MainPane";
import Router, { Navigate, Route, useHistory } from "reblend-router";
import ErrorWrapper from "./pages/ErrorWrapper";
import Footer from "./layout/Footer";
import ThemeToggler from "./layout/layout_components/ThemeToggler";
import {
  activeThemeContext,
  theme,
  ThemeContext,
} from "./components/context/theme";
import { ToastContainer } from "react-toastify";
import SharedConfig from "./scripts/SharedConfig";
import Refresh from "./pages/Refresh";

function App() {
  const [currentApiVersion] = useContext(versionContext);
  const [api, setApi] = useState<IAPI>([]);
  const [currentApi, setCurrentApi] = useState<Version | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(!(window.innerWidth < 768));
  const [refresh, setRefresh] = useState(false);
  const [history] = useHistory();
  const [view] = useContext(viewContext);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => handleResize());
    return () => {
      window.removeEventListener("resize", () => handleResize());
    };
  }, []);

  useEffect(() => {
    if (!api || api.length < 1) {
      fetch(`/cdn/APIDoc.json`)
        .then((res) => res.json())
        .then((data) => setApi(data));
      return;
    }

    const curr = api.find((val) => val.info.version === currentApiVersion);

    setCurrentApi(curr || null);
    const vers = api.map((ver) => ver.info.version);
    setVersions(vers);
  }, [api, currentApiVersion]);

  const [activeTheme, setActiveTheme] = useContext(activeThemeContext);
  const [styles, setStyle] = useContext(ThemeContext);

  useEffect(() => {
    setStyle(theme[activeTheme]);
  }, [activeTheme]);

  const toggleTheme = () => {
    setActiveTheme(activeTheme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (!history.includes("refresh")) {
      SharedConfig.set("previousPage", history);
    }
  }, [history]);

  useEffect(
    () => {
      setRefresh(false);

      const handleKeyPress = (event: any) => {
        if (event.key === "F5") {
          event.preventDefault(); // Prevent the default F5 behavior
          setRefresh(true);
        }
      };

      window.addEventListener("keydown", handleKeyPress);

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    },
    [
      /* history */
    ]
  );

  return (
    <ErrorWrapper>
      <div className="swagger-ui" style={styles}>
        <ToastContainer
          newestOnTop={true}
          toastStyle={{ borderRadius: 20, padding: 5 }}
        />
        <Router>
          {refresh ? <Navigate to="/refresh" /> : null}
          <Route path="*" element={<></>} />
          <Route path="/refresh" Component={Refresh} />
        </Router>
        <SVGDefinition />
        <InfoContainer versions={versions} info={currentApi?.info} />
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "flex-start",
          }}
        >
          <div
            id="sidebar"
            class="sidebar"
            style={{
              width: sidebarOpen ? "250px" : "1px",
            }}
          >
            {currentApi && currentApi?.controllerRoutes && (
              <SideBarItems controllerRoutes={currentApi?.controllerRoutes} />
            )}
          </div>

          <div>
            <button
              class="open-btn"
              onclick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "X" : "☰"}
            </button>

            <button
              class="open-btn"
              style={{
                backgroundColor: view === View.HISTORY ? "gray" : "black",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "6px",
              }}
              onclick={() => viewContext.update(View.HISTORY)}
            >
              History
            </button>

            <button
              class="open-btn"
              style={{
                backgroundColor: view === View.CUSTOM ? "gray" : "black",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "6px",
              }}
              onclick={() => viewContext.update(View.CUSTOM)}
            >
              Custom
            </button>

            <button
              class="open-btn"
              style={{
                backgroundColor: view === View.REST ? "gray" : "black",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "6px",
              }}
              onclick={() => viewContext.update(View.REST)}
            >
              Rest
            </button>
          </div>

          <div class="sidebar-main-pane">
            {currentApi && currentApi?.controllerRoutes && (
              <MainPane controllerRoutes={currentApi?.controllerRoutes} />
            )}
          </div>
        </div>
        <SchemaBlock />
        <Footer>
          <ThemeToggler
            toggleTheme={() => {
              toggleTheme();
            }}
          />
        </Footer>
        <div className="content-backdrop fade"></div>
      </div>
    </ErrorWrapper>
  );
}

export default App;
