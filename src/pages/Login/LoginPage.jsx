import React, { useState, useContext } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await login(email, password);
      console.log("Login Berhasil:", userData);

      // SAFETY CHECK: Pastikan userData valid sebelum cek role
      if (!userData || !userData.role) {
        throw new Error("Gagal mendapatkan data user.");
      }

      // Normalisasi string role (jaga-jaga jika backend kirim huruf besar/kecil)
      const role = userData.role.toLowerCase();

      if (role === "issuer") {
        navigate("/issuer/dashboard");
      } else if (role === "owner" || role === "holder") { // Handle kedua kemungkinan
        navigate("/holder/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"} // Toggle type
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '40px' }} // Kasih ruang untuk icon
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>
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
