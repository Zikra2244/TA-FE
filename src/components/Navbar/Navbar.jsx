import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Import Context
import { AuthContext } from "../../context/AuthContext";
import { Web3Context } from "../../context/Web3Context";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { connectWallet, currentAccount, disconnectWallet } =
    useContext(Web3Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate("/");
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // --- PERBAIKAN: Fungsi Penerjemah Role ---
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin Institusi";
      case "issuer":
        return "Penerbit";
      case "owner":
        return "Mahasiswa";
      default:
        return "User";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>🎓 VeriChain</span>
        </Link>

        <div className="navbar-menu">
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
            <div className="nav-actions logged-in">
              {/* Info User */}
              <div className="user-profile">
                <span className="user-name">
                  Halo, {user.fullName || "User"}
                </span>
                {/* Panggil fungsi getRoleLabel di sini */}
                <span className={`user-role-badge ${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* Tombol Web3 */}
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
