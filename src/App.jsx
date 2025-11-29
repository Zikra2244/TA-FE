import React from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
// Hapus import Navbar dan Web3Context untuk sementara
// import Navbar from './components/Navbar';
// import { Web3Context } from './context/Web3Context';

function App() {
  return (
    <div className="app-container">
      {/* Semua logika wallet/status koneksi kita sembunyikan dulu */}
      <LandingPage />
    </div>
  );
}

export default App;
