import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import { DApp } from "./DApp";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <DApp />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
