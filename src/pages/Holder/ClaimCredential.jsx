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
          }}
        >
          <div
            className="card"
            style={{ maxWidth: "500px", textAlign: "center" }}
          >
            <div style={{ margin: "0 auto 1.5rem", color: "#10b981" }}>
              <CheckCircle
                size={64}
                style={{ display: "block", margin: "0 auto" }}
              />
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              Klaim Berhasil!
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
              {successData.message}
            </p>

            <div className="tx-hash-box">
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: "0.25rem",
                }}
              >
                Transaction Hash
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${successData.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="tx-link"
              >
                {successData.txHash}
              </a>
            </div>
            <button
              onClick={() => navigate("/holder/dashboard")}
              className="btn btn-primary"
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
