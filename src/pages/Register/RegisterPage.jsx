import React, { useState, useContext } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Pemilik Dokumen");
  const [institutionName, setInstitutionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const backendRole = role === "Pemilik Dokumen" ? "owner" : "issuer";
      await register(fullName, email, password, backendRole, institutionName);

      alert("Registrasi Berhasil! Silakan Masuk.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Tombol Kembali Konsisten */}
      <Link to="/" className="back-link">
        ← Kembali
      </Link>

      <div className="register-container">
        <div className="register-card">
          <div className="card-shine"></div>

          <div className="form-header">
            <span className="brand-logo">🎓 VeriChain</span>
            <h2 className="form-title">Buat Akun Baru</h2>
            <p className="form-subtitle">Mulai perjalanan aset digital Anda.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nama Lengkap Anda"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@contoh.com"
              />
            </div>

            <div className="input-group">
              <label>Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div className="input-group">
              <label>Daftar sebagai</label>
              <div className="select-wrapper">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Pemilik Dokumen">Pemilik Dokumen</option>
                  <option value="Penerbit">Penerbit (Institusi)</option>
                </select>
              </div>
            </div>

            {/* Field Kondisional dengan Animasi */}
            {role === "Penerbit" && (
              <div className="input-group animate-fade-in">
                <label>Nama Institusi</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  required
                  placeholder="Contoh: Universitas Telkom"
                />
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="loader"></span> : "Daftar Sekarang"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Sudah punya akun?{" "}
              <Link to="/login" className="link-highlight">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
