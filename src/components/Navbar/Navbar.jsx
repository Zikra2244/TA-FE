import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

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
              <div className="user-profile">
                <span className="user-name">
                  Halo, {user.fullName || "User"}
                </span>
                <span className={`user-role-badge ${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

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
