import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate

// Import Halaman Utama
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

// Import Halaman Admin
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import { Web3Provider } from "./context/Web3Context";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  // ... (Kode prevent zoom biarkan saja)

  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ADMIN ROUTES */}
            {/* 1. Akses /admin langsung redirect ke login admin */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />

            {/* 2. Login Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* 3. Dashboard Admin (Halaman Terproteksi) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
