import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages Umum
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

// Pages Admin
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Pages Issuer (Penerbit)
import IssuerDashboard from "./pages/Issuer/IssuerDashboard";
import IssuePage from "./pages/Issuer/IssuePage"; // Pastikan nama file ini sesuai (IssuePage.jsx atau IssueCertificate.jsx)

// Pages Holder (Pemilik/Mahasiswa) -- INI YANG BARU DITAMBAHKAN
import HolderDashboard from "./pages/Holder/HolderDashboard";
import ClaimCredential from "./pages/Holder/ClaimCredential";

// Contexts
import { Web3Provider } from "./context/Web3Context";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            {/* Route Umum */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Route Admin */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Route Issuer */}
            <Route path="/issuer/dashboard" element={<IssuerDashboard />} />
            <Route path="/issuer/issue" element={<IssuePage />} />

            {/* Route Holder (Mahasiswa) */}
            <Route path="/holder/dashboard" element={<HolderDashboard />} />
            <Route path="/holder/claim" element={<ClaimCredential />} />

          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;