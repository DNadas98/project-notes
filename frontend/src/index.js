import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider";
import { LoadingProvider } from "./context/LoadingProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  /*<React.StrictMode>*/
  <BrowserRouter>
    <AuthProvider>
      <LoadingProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </LoadingProvider>
    </AuthProvider>
  </BrowserRouter>
  /*</React.StrictMode>*/
);
