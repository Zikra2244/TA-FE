import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Web3Context } from "../../context/Web3Context";
import "./HolderStyles.css";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  User,
  Hash,
  FileBadge,
  Key,
  GraduationCap,
  Award,
  Wallet,
  Baby,
} from "lucide-react";

const ClaimCredential = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { currentAccount } = useContext(Web3Context);

  const [docType, setDocType] = useState("ijazah");

  const [fullName, setFullName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [certTitle, setCertTitle] = useState("");

  const [docSerial, setDocSerial] = useState("");
  const [motherName, setMotherName] = useState("");
  const [certRecommendations, setCertRecommendations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);
  useEffect(() => {
    const fetchCertTypes = async () => {
      try {
        const response = await axios.get("/credentials/cert-types");

        if (Array.isArray(response.data)) {
          setCertRecommendations(response.data);
        } else if (response.data.types && Array.isArray(response.data.types)) {
          setCertRecommendations(response.data.types);
        }
      } catch (err) {
        console.error("Gagal mengambil tipe sertifikat:", err);
      }
    };

    fetchCertTypes();
  }, []);

  useEffect(() => {
    if (currentAccount) setError("");
  }, [currentAccount]);

  const selectSuggestion = (value) => {
    setCertTitle(value);
    setShowSuggestions(false);
  };

  const handleClaim = async (e) => {
    e.preventDefault();

    if (!currentAccount) {
      setError("Wallet belum terhubung! Silakan hubungkan wallet di Navbar.");
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessData(null);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        doc_type: docType,
        wallet_address: currentAccount,

        full_name: fullName,
        identity_number: docType === "ijazah" ? identityNumber : undefined,
        cert_title: docType === "sertifikat" ? certTitle : undefined,

        doc_serial: docSerial,
        mother_name: docType === "ijazah" ? motherName : undefined,
      };

      const response = await axios.post(`/credentials/claim`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessData(response.data);
    } catch (err) {
      console.error("Claim Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Gagal melakukan klaim. Pastikan data yang dimasukkan sesuai."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    if (successData.alreadyClaimed) {
      return (
        <div className="holder-dashboard">
          <Navbar />
          <div
            className="holder-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: "450px",
                textAlign: "center",
                background: "linear-gradient(145deg, #1e293b, #0f172a)",
                border: "1px solid rgba(14, 165, 233, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                padding: "3rem 2rem",
                borderRadius: "24px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #0ea5e9, #38bdf8)"
              }}></div>
              
              <div style={{ 
                margin: "0 auto 1.5rem", 
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)"
              }}>
                <ShieldCheck
                  size={40}
                  color="#38bdf8"
                  strokeWidth={2}
                />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  marginBottom: "0.75rem",
                  color: "white",
                  letterSpacing: "0.5px"
                }}
              >
                Kredensial Aman
              </h2>
              <div style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "2rem"
              }}>
                <p style={{ color: "#e2e8f0", margin: 0, lineHeight: "1.6", fontSize: "0.95rem" }}>
                  Anda telah mengklaim dokumen ini sebelumnya. <br/> 
                  <strong style={{ color: "#38bdf8" }}>{successData.data.program_name || successData.data.document_type}</strong> 
                  <br />sudah tersimpan di dompet Anda.
                </p>
              </div>
              
              <button
                onClick={() => navigate("/holder/dashboard")}
                className="btn btn-primary"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  boxShadow: "0 4px 15px rgba(2, 132, 199, 0.4)",
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "12px",
                  fontSize: "1.05rem"
                }}
              >
                Lihat Koleksi Kredensial Saya
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="holder-dashboard">
        <Navbar />
        <div
          className="holder-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: "500px",
              textAlign: "center",
              background: "linear-gradient(145deg, #1e293b, #0f172a)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
              padding: "3rem 2.5rem",
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #10b981, #34d399)"
            }}></div>

            <div style={{ 
              margin: "0 auto 1.5rem", 
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
            }}>
              <CheckCircle
                size={40}
                color="#34d399"
                strokeWidth={2}
              />
            </div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: "white",
                letterSpacing: "0.5px"
              }}
            >
              Klaim Berhasil!
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "1.05rem" }}>
              {successData.message}
            </p>

            <div className="tx-hash-box" style={{ 
              marginBottom: "2rem", 
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: "12px",
              padding: "1.25rem",
              position: "relative"
            }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#34d399",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                Bukti Transaksi Blockchain
              </p>
              
              {successData.txHash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${successData.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tx-link"
                  style={{
                    display: "block",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    color: "#e2e8f0",
                    wordBreak: "break-all",
                    lineHeight: "1.4",
                    textDecoration: "none",
                    padding: "0.5rem",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "6px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)' }}
                >
                  {successData.txHash}
                </a>
              ) : (
                <div style={{
                  padding: "0.5rem",
                  fontStyle: "italic",
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "6px"
                }}>
                  Sinkronisasi wallet... (Silakan cek dashboard berkala)
                </div>
              )}
            </div>
            
            <button
              onClick={() => navigate("/holder/dashboard")}
              className="btn btn-primary"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                fontSize: "1.05rem"
              }}
            >
              Lihat di Dashboard Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="holder-dashboard">
      <Navbar />

      {/* --- ERROR MODAL POPUP --- */}
      {error && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)"
        }}>
          <div className="card animate-fadeIn" style={{
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
            padding: "2rem",
            position: "relative",
            borderTop: "4px solid #ef4444"
          }}>
            <div style={{ margin: "0 auto 1rem", color: "#f87171" }}>
              <AlertCircle
                size={56}
                strokeWidth={1.5}
                style={{ display: "block", margin: "0 auto" }}
              />
            </div>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "white",
            }}>
              Klaim Ditolak
            </h2>
            <div style={{
              backgroundColor: "#202020",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid #334155"
            }}>
              <p style={{ color: "#e2e8f0", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
                {error}
              </p>
            </div>
            <button
              onClick={() => setError("")}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: "600"
              }}
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      <div className="holder-container">
        <header
          className="dashboard-header"
          style={{ justifyContent: "center", textAlign: "center" }}
        >
          <div className="header-title">
            <h1>Klaim Aset Digital</h1>
            <p>Lengkapi data identitas dan data rahasia untuk verifikasi.</p>
          </div>
        </header>

        <div className="card claim-form-container">
          <form onSubmit={handleClaim}>
            <div className="form-group">
              <label className="form-label">PILIH JENIS DOKUMEN</label>
              <div className="toggle-grid">
                <button
                  type="button"
                  onClick={() => setDocType("ijazah")}
                  className={`btn-toggle ${
                    docType === "ijazah" ? "active" : ""
                  }`}
                >
                  <GraduationCap size={24} style={{ marginBottom: "0.5rem" }} />
                  <span>Ijazah Sarjana</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocType("sertifikat")}
                  className={`btn-toggle ${
                    docType === "sertifikat" ? "active" : ""
                  }`}
                >
                  <Award size={24} style={{ marginBottom: "0.5rem" }} />
                  <span>Sertifikat / Lainnya</span>
                </button>
              </div>
            </div>

            <div
              className="form-group"
              style={{ borderTop: "1px solid #334155", paddingTop: "1.5rem" }}
            >
              <label
                className="form-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#2dd4bf",
                }}
              >
                <User size={18} /> 1. IDENTITAS PEMILIK
              </label>

              <div className="form-group">
                <label
                  className="form-label"
                  style={{ textTransform: "none", color: "#94a3b8" }}
                >
                  Nama Lengkap
                </label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Nama sesuai dokumen"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {docType === "ijazah" ? (
                <div className="form-group animate-fadeIn">
                  <label
                    className="form-label"
                    style={{ textTransform: "none", color: "#94a3b8" }}
                  >
                    NIM / NISN
                  </label>
                  <div className="input-with-icon">
                    <div className="input-icon-left">
                      <Hash size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Nomor Induk Mahasiswa"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="form-group animate-fadeIn"
                  style={{ position: "relative" }}
                >
                  <label
                    className="form-label"
                    style={{ textTransform: "none", color: "#94a3b8" }}
                  >
                    Jenis / Nama Sertifikasi
                  </label>

                  <div className="input-with-icon">
                    <div className="input-icon-left">
                      <FileBadge size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Ketik untuk melihat rekomendasi..."
                      value={certTitle}
                      onChange={(e) => {
                        setCertTitle(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      autoComplete="off"
                    />
                  </div>

                  {showSuggestions && (
                    <ul className="suggestions-list">
                      {certRecommendations
                        .filter((item) =>
                          item.toLowerCase().includes(certTitle.toLowerCase())
                        )
                        .map((item, index) => (
                          <li
                            key={index}
                            onMouseDown={() => selectSuggestion(item)}
                            className="suggestion-item"
                          >
                            {item}
                          </li>
                        ))}

                      {certRecommendations.filter((item) =>
                        item.toLowerCase().includes(certTitle.toLowerCase())
                      ).length === 0 &&
                        certTitle && (
                          <li
                            className="suggestion-item"
                            style={{ color: "#64748b", cursor: "default" }}
                          >
                            Tidak ada rekomendasi yang cocok
                          </li>
                        )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div
              className="form-group"
              style={{ borderTop: "1px solid #334155", paddingTop: "1.5rem" }}
            >
              <label
                className="form-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#f59e0b",
                }}
              >
                <Key size={18} /> 2. VERIFIKASI RAHASIA
              </label>

              <div className="form-group">
                <label
                  className="form-label"
                  style={{ textTransform: "none", color: "#94a3b8" }}
                >
                  Nomor Seri Dokumen
                </label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <Hash size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Contoh: SK-2024-001"
                    value={docSerial}
                    onChange={(e) => setDocSerial(e.target.value)}
                  />
                </div>
              </div>

              {docType === "ijazah" && (
                <div className="form-group animate-fadeIn">
                  <label
                    className="form-label"
                    style={{ textTransform: "none", color: "#94a3b8" }}
                  >
                    Nama Ibu Kandung
                  </label>
                  <div className="input-with-icon">
                    <div className="input-icon-left">
                      <Baby size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Sesuai PDDIKTI"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !currentAccount}
              className="btn btn-primary"
              style={{
                marginTop: "1rem",
                opacity: !currentAccount ? 0.5 : 1,
                cursor: !currentAccount ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>Memproses Verifikasi...</>
              ) : !currentAccount ? (
                <>Hubungkan Wallet Terlebih Dahulu</>
              ) : (
                <>
                  <ShieldCheck size={20} /> Klaim Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimCredential;
