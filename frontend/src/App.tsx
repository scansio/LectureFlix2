import Reblend, { SharedConfig, useContext, useEffect } from "reblendjs";
import Router, { Route } from "reblend-router";
import Notfound from "./pages/Notfound";
import ErrorHandler from "./layouts/ErrorHandler";
import { routes } from "./routes";
import { UID } from "./scripts/config/contants";
import { rand } from "./scripts/md5";
import { Container, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { netErrContext } from "./context";

function App() {
  const [noNetwork, setNoNetwork] = useContext(netErrContext);

  useEffect(() => {
    if (!SharedConfig.getLocalData(UID)) {
      SharedConfig.setLocalData(
        UID,
        (crypto && crypto.randomUUID && crypto.randomUUID()) ||
          rand(0x9988aac, 0xfffffff)
      );
    }
  }, []);

  return (
    <>
      <style>
        {`a {
            text-decoration: none !important;
          }`}
      </style>
      <Notfound />
      <Router />
      {Object.entries(routes).map(([path, Component]) => (
        <Route
          element={
            <ErrorHandler>
              <Component />
            </ErrorHandler>
          }
          path={path}
        />
      ))}
      <Modal
        show={noNetwork}
        backdrop
        fullscreen
        onHide={() => setNoNetwork(false)}
      >
        <ModalHeader closeButton onHide={() => setNoNetwork(false)} />
        <ModalBody>
          <Container>
            <h2
              className="font-xl center text-center"
              style={{ margin: "10px", fontWeight: 900, fontSize: "100px" }}
            >
              Seems there's no network
            </h2>
          </Container>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
