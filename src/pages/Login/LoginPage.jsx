import React, { useState, useContext } from "react"; // <--- Tambahkan useContext di sini
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengambil fungsi login dari AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Panggil fungsi login asli dari Context
      await login(email, password);

      // Jika sukses, arahkan ke Home/Dashboard
      console.log("Login Berhasil!");
      navigate("/");
    } catch (err) {
      console.error(err);
      // Tampilkan pesan error dari backend jika ada, atau pesan default
      setError(err.message || "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-link">
        ← Kembali
      </Link>

      <div className="login-container">
        <div className="login-card">
          <div className="card-shine"></div>

          <div className="form-header">
            <span className="brand-logo">🎓 VeriChain</span>
            <h2 className="form-title">Selamat Datang Kembali</h2>
            <p className="form-subtitle">
              Masuk untuk mengelola aset digital Anda.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="nama@institusi.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Kata Sandi</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="loader"></span> : "Masuk Platform"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Belum punya akun?{" "}
              <Link to="/register" className="link-highlight">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
