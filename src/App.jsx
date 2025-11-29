import React from "react";
// Import komponen utama Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Halaman yang sudah kita buat
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

// Import Provider Web3 Anda
import { Web3Provider } from "./context/Web3Context";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    // 1. BrowserRouter: Memberitahu React bahwa kita akan menggunakan routing
    <BrowserRouter>
      {/* 2. Web3Provider: Kita bungkus semua Route di dalam Web3 Context */}
      {/* Agar data wallet (currentAccount) bisa diakses di semua halaman */}
      <AuthProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
