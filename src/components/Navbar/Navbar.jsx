import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Import Context
import { AuthContext } from "../../context/AuthContext";
import { Web3Context } from "../../context/Web3Context";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { connectWallet, currentAccount } = useContext(Web3Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Helper untuk memendekkan alamat wallet (0x1234...5678)
  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span>🎓 VeriChain</span>
        </Link>

        {/* MENU UTAMA (Desktop) */}
        <div className="navbar-menu">
          {/* KONDISI 1: Belum Login (GUEST) */}
          {!user ? (
            <div className="nav-actions">
              <Link to="/login" className="nav-link">
                Masuk
              </Link>
              <Link to="/register" className="nav-btn-primary">
                Daftar Akun
              </Link>
            </div>
          ) : (
            /* KONDISI 2: Sudah Login (USER) */
            <div className="nav-actions logged-in">
              {/* Info User Web2 */}
              <div className="user-profile">
                <span className="user-name">
                  Halo, {user.fullName || "User"}
                </span>
                <span className="user-role-badge">
                  {user.role === "issuer" ? "Penerbit" : "Mahasiswa"}
                </span>
              </div>

              {/* Tombol Web3 / Wallet */}
              {!currentAccount ? (
                <button onClick={connectWallet} className="nav-btn-connect">
                  🔗 Hubungkan Wallet
                </button>
              ) : (
                <div className="wallet-badge">
                  <span className="dot-online"></span>
                  {shortenAddress(currentAccount)}
                </div>
              )}

              {/* Tombol Logout */}
              <button onClick={handleLogout} className="nav-btn-logout">
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
