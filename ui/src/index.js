import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./contexts";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <App />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
