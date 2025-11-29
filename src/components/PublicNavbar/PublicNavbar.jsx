import React from "react";
import "./PublicNavbar.css";

const PublicNavbar = () => {
  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* Ganti dengan Logo Anda jika ada */}
          <span>🎓 VeriChain</span>
        </div>
        <div className="navbar-links">
          <button className="nav-button-login">Masuk</button>
          <button className="nav-button-register">Daftar</button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
