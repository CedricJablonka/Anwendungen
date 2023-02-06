import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import GeneralState from "./context/general-context/GeneralState";
import CompleteStreetState from "./context/complete-street-context/CompleteStreetState";

ReactDOM.render(
  <GeneralState>
    <CompleteStreetState>
      <App />
    </CompleteStreetState>
  </GeneralState>,
  document.getElementById("root")
);
