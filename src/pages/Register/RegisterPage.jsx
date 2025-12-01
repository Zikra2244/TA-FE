import React, { useState, useContext } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State baru
  const [role, setRole] = useState("Pemilik Dokumen");
  const [institutionName, setInstitutionName] = useState("");

  const [showPassword, setShowPassword] = useState(false); // State untuk toggle mata
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Validasi Password Cocok
    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi tidak cocok.");
      setLoading(false);
      return;
    }

    // 2. Validasi Panjang Password (Opsional tapi disarankan)
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      setLoading(false);
      return;
    }

    try {
      const backendRole = role === "Pemilik Dokumen" ? "owner" : "issuer";
      await register(fullName, email, password, backendRole, institutionName);

      if (backendRole === "issuer") {
        alert(
          "Registrasi Berhasil! Akun Anda menunggu persetujuan Admin Institusi."
        );
      } else {
        alert("Registrasi Berhasil! Silakan Masuk.");
      }
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
                placeholder={
                  role === "Penerbit"
                    ? "nama@domain-institusi.ac.id"
                    : "email@pribadi.com"
                }
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="input-group">
              <label>Kata Sandi</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    /* Icon Mata Terbuka (SVG) */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    /* Icon Mata Tertutup (SVG) */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="input-group">
              <label>Konfirmasi Kata Sandi</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Ulangi kata sandi"
                />
                {/* Kita gunakan toggle yang sama untuk kedua field agar sinkron */}
              </div>
            </div>

            <div className="input-group">
              <label>Daftar sebagai</label>
              <div className="select-wrapper">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Pemilik Dokumen">Pemilik Dokumen</option>
                  <option value="Penerbit">Penerbit</option>
                </select>
              </div>
            </div>

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
