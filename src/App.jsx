import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import IssuerDashboard from "./pages/Issuer/IssuerDashboard";
import IssuePage from "./pages/Issuer/IssuePage";

import HolderDashboard from "./pages/Holder/HolderDashboard";
import ClaimCredential from "./pages/Holder/ClaimCredential";

import { Web3Provider } from "./context/Web3Context";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/issuer/dashboard" element={<IssuerDashboard />} />
            <Route path="/issuer/issue" element={<IssuePage />} />

            <Route path="/holder/dashboard" element={<HolderDashboard />} />
            <Route path="/holder/claim" element={<ClaimCredential />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
