import Reblend from "reblendjs";
import "./assets/index.css";
import "./assets/swagger-ui.css";
import "highlight.js/scss/intellij-light.scss";
import App from "./App";
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js';

import "./assets/vendor/fonts/boxicons.css";
import "./assets/css/scansio-style.css";
import "./assets/css/util.css";
import "./assets/css/main.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.scss";
import "./assets/vendor/js/helpers.js";
import "./assets/js/config.js";
import "./assets/vendor/libs/jquery/jquery.js";
// import "react-quill/dist/quill.snow.css";
// import './scripts/lib/scansio-script.js'
import "./assets/vendor/libs/popper/popper.js";
// import "../node_modules/perfect-scrollbar/dist/perfect-scrollbar.js";
import "./assets/vendor/js/menu.js";
import "./assets/js/main.js";
import "./assets/css/custom-style.scss";

import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";

let pathname =
  "/" + window.location.pathname.split("/").filter(Boolean).join("/");

(window as any).REBLEND_BASE_PATHNAME = pathname;
Reblend.mountOn("root", App);
