import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import("./Pages/Home"));
const LoginPage = lazy(() => import("./Pages/Login"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const EmailVerified = lazy(() => import("./Pages/EmailVerified"));
const RegisterPage = lazy(() => import("./Pages/Register"));
const VerifyEmail = lazy(() => import("./Pages/EnterOTPforPassword"));
const RegisteredEmail = lazy(()=>import("./Pages/RegisteredEmail"));
const EnterOTPforPassword = lazy(()=>import("./Pages/EnterOTPforPassword"));

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/LoginPage" element={<LoginPage />}></Route>
        <Route path="/ResetPassword" element={<ResetPassword />}></Route>
        <Route path="/EmailVerified" element={<EmailVerified />}></Route>
        <Route path="/RegisterPage" element={<RegisterPage />}></Route>
        <Route path="/VerifyEmail" element={<VerifyEmail />}></Route>
        <Route path="/ResetPassword" element={<ResetPassword />}></Route>
        <Route path="/RegisteredEmail" element={<RegisteredEmail />}></Route>
        <Route path="/EnterOTPforPassword" element={<EnterOTPforPassword />}></Route>
      </Routes>
    </>
  );
}

export default App;
