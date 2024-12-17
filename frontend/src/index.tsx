import Reblend from "reblendjs";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";


let pathname =
  "/" + window.location.pathname.split("/").filter(Boolean).join("/");

(window as any).REBLEND_BASE_PATHNAME = pathname;

Reblend.mountOn("root", App);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CREBA-vitals
reportWebVitals();
