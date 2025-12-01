import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./AdminStyles.css"; // Kita buat CSS khusus admin nanti

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kita gunakan fungsi login manual di sini karena butuh cek role spesifik
  // atau kita bisa update AuthContext, tapi manual di sini lebih aman utk isolasi
  const { setUser, setToken } = useContext(AuthContext); // Asumsi AuthContext expose setter (jika tidak, sesuaikan)
  // *Jika AuthContext tidak expose setter, gunakan fungsi login() biasa lalu cek user.role*
  // Mari gunakan cara standar AuthContext:
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Panggil fungsi login global
      const success = await login(email, password);

      if (success) {
        // Cek localstorage atau state untuk memastikan dia admin
        const userData = JSON.parse(localStorage.getItem("user_data"));

        if (userData.role !== "admin") {
          setError("Akses Ditolak. Akun ini bukan Admin Institusi.");
          // Logout paksa jika bukan admin
          localStorage.clear();
          window.location.reload();
          return;
        }

        // Redirect ke Dashboard Admin
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
