import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import GeneralState from "./context/general-context/GeneralState";


ReactDOM.render(
  <GeneralState>
    <App />
  </GeneralState>,
  document.getElementById("root")
);
