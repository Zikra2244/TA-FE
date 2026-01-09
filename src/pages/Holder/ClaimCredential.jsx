import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
// 1. IMPORT Web3Context
import { Web3Context } from "../../context/Web3Context"; 
import "./HolderStyles.css"; 
import { ShieldCheck, AlertCircle, CheckCircle, FileText, Key, GraduationCap, Award, Wallet } from "lucide-react";

const ClaimCredential = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // 2. AMBIL DATA WALLET DARI CONTEXT (Yang dikontrol oleh Navbar)
  const { currentAccount } = useContext(Web3Context);

  // State Form
  const [credentialId, setCredentialId] = useState("");
  const [docType, setDocType] = useState("ijazah"); 
  const [nim, setNim] = useState("");
  const [motherName, setMotherName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Efek untuk membersihkan error jika wallet terhubung
  useEffect(() => {
    if (currentAccount) {
      setError("");
    }
  }, [currentAccount]);

  const handleClaim = async (e) => {
    e.preventDefault();
    
    // 3. VALIDASI: CEK APAKAH WALLET SUDAH TERHUBUNG DI NAVBAR
    if (!currentAccount) {
      setError("Wallet belum terhubung! Silakan klik tombol 'Hubungkan Wallet' di pojok kanan atas (Navbar) sebelum melanjutkan.");
      window.scrollTo(0, 0); // Scroll ke atas agar user lihat Navbar
      return;
    }

    setLoading(true);
    setError("");
    setSuccessData(null);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        input_nim: docType === "ijazah" ? nim : undefined,
        input_mother_name: docType === "ijazah" ? motherName : undefined,
        input_serial: docType === "sertifikat" ? serialNumber : undefined,
        // Kirim wallet address user untuk memastikan ownership
        wallet_address: currentAccount 
      };

      // API Call
      const response = await axios.post(
        `/credentials/claim/${credentialId}`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessData(response.data);

    } catch (err) {
      console.error("Claim Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat mengklaim dokumen.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- TAMPILAN SUKSES (Tetap sama) ---
  if (successData) {
    return (
      <div className="holder-dashboard">
        <Navbar />
        <div className="holder-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 1.5rem', color: '#10b981' }}>
              <CheckCircle size={64} style={{ display: 'block', margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Klaim Berhasil!</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{successData.message}</p>
            
            <div className="tx-hash-box">
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.25rem' }}>Transaction Hash</p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${successData.txHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="tx-link"
              >
                {successData.txHash}
              </a>
            </div>
            <button onClick={() => navigate("/holder/dashboard")} className="btn btn-primary">
              Lihat di Dashboard Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN FORM UTAMA ---
  return (
    <div className="holder-dashboard">
      <Navbar />

      <div className="holder-container">
        <header className="dashboard-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div className="header-title">
            <h1>Klaim Aset Digital</h1>
            <p>Pastikan Wallet Anda terhubung di pojok kanan atas.</p>
          </div>
        </header>

        <div className="card claim-form-container">
          
          {/* 4. NOTIFIKASI JIKA WALLET BELUM CONNECT */}
          {!currentAccount && !error && (
            <div className="alert alert-error" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fde047' }}>
              <Wallet size={24} />
              <div>
                <strong>Wallet Belum Terhubung</strong>
                <p className="mb-0" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Fitur klaim membutuhkan koneksi wallet. Silakan hubungkan wallet Anda melalui Navbar di atas.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner Normal */}
          {error && (
            <div className="alert alert-error" style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
              <AlertCircle size={20} className="shrink-0" />
              <div>
                <strong>Gagal Mengklaim</strong>
                <p className="mb-0">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleClaim}>
            
            {/* Input Form (Credential ID, DocType, Verification) - KODE SAMA SEPERTI SEBELUMNYA */}
            {/* Saya persingkat bagian ini agar fokus pada logika wallet */}
            <div className="form-group">
              <label className="form-label">1. MASUKKAN ID KREDENSIAL</label>
              <div className="input-with-icon">
                <div className="input-icon-left"><FileText size={20} /></div>
                <input
                  type="text" required placeholder="Contoh: 65a1b2c3d4..." className="form-input"
                  value={credentialId} onChange={(e) => setCredentialId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">2. JENIS DOKUMEN</label>
              <div className="toggle-grid">
                <button type="button" onClick={() => setDocType("ijazah")} className={`btn-toggle ${docType === "ijazah" ? "active" : ""}`}>
                  <GraduationCap size={24} style={{ marginBottom: '0.5rem' }} /><span>Ijazah Sarjana</span>
                </button>
                <button type="button" onClick={() => setDocType("sertifikat")} className={`btn-toggle ${docType === "sertifikat" ? "active" : ""}`}>
                  <Award size={24} style={{ marginBottom: '0.5rem' }} /><span>Sertifikat / Lainnya</span>
                </button>
              </div>
            </div>

            <div className="form-group" style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={16} /> 3. VERIFIKASI DATA RAHASIA
              </label>
              {docType === "ijazah" ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="form-group">
                    <label className="form-label">Nomor Induk Mahasiswa (NIM)</label>
                    <input type="text" required className="form-input" value={nim} onChange={(e) => setNim(e.target.value)} placeholder="Masukkan NIM Anda" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Ibu Kandung</label>
                    <input type="text" required className="form-input" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Sesuai data di PDDIKTI" />
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="form-group">
                    <label className="form-label">Nomor Seri Sertifikat</label>
                    <input type="text" required className="form-input" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Contoh: SK-2024-001" />
                  </div>
                </div>
              )}
            </div>

            {/* 5. TOMBOL SUBMIT DINAMIS */}
            <button
              type="submit"
              // Disable tombol jika loading ATAU wallet belum connect
              disabled={loading || !currentAccount}
              className="btn btn-primary"
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem',
                // Ubah tampilan visual jika disabled karena wallet
                opacity: !currentAccount ? 0.5 : 1,
                cursor: !currentAccount ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>Processing...</>
              ) : !currentAccount ? (
                <>
                  <Wallet size={20} /> Hubungkan Wallet Terlebih Dahulu
                </>
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