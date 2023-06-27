import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/auth/login.page";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
