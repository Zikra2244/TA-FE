import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./AdminStyles.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, setToken } = useContext(AuthContext);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        const userData = JSON.parse(localStorage.getItem("user_data"));

        if (userData.role !== "admin") {
          setError("Akses Ditolak. Akun ini bukan Admin Institusi.");
          localStorage.clear();
          window.location.reload();
          return;
        }

        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-login-card">
        <div className="admin-header">
          <h2>🛡️ Admin Portal</h2>
          <p>VeriChain Institution Management</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleAdminLogin}>
          <div className="admin-input-group">
            <label>Email Institusi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="admin-btn-submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
