import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./HolderStyles.css";
import QRCode from "react-qr-code";
import {
  Wallet,
  Share2,
  X,
  Copy,
  FileText,
  CheckCircle,
  ExternalLink,
  Download,
  PlusCircle,
} from "lucide-react";

const HolderDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Share
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocForShare, setSelectedDocForShare] = useState(null);

  useEffect(() => {
    // Redirect jika bukan student (opsional, sesuaikan logic)
    if (user && user.role !== "student") {
      // navigate("/"); // Uncomment jika ingin membatasi akses
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyDocuments = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/credentials/my-documents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // DEBUG: Cek struktur data di console browser
        console.log("Data Dokumen Saya:", response.data);

        setDocuments(response.data);
      } catch (err) {
        console.error("Gagal mengambil dokumen:", err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDocuments();
  }, [user]);

  if (!user) return null;

  // --- FUNGSI UTAMA PERBAIKAN ---
  const handleOpenShare = (doc) => {
    // Cek ID yang valid. Prioritaskan credential_id, fallback ke id, lalu token_id
    const validId = doc.credential_id || doc.id || doc.token_id;

    if (!validId) {
      alert(
        "ID Dokumen tidak valid atau belum digenerate. Tidak dapat membagikan."
      );
      console.error("Dokumen bermasalah (Missing ID):", doc);
      return;
    }

    // Pastikan object state memiliki properti 'credential_id' yang konsisten
    setSelectedDocForShare({ ...doc, credential_id: validId });
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (!selectedDocForShare || !selectedDocForShare.credential_id) {
      alert("Link tidak valid.");
      return;
    }
    const url = `${window.location.origin}/verify/${selectedDocForShare.credential_id}`;
    navigator.clipboard.writeText(url);
    alert("Link verifikasi berhasil disalin ke clipboard!");
  };

  return (
    <div className="holder-dashboard">
      <Navbar />

      <main className="holder-container">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Dompet Digital Akademik</h1>
            <p>
              Selamat datang, <strong>{user.fullName || user.username}</strong>
            </p>
          </div>
        </header>

        <div className="action-banner">
          <div className="banner-content">
            <h2>Belum punya Ijazah Digital di Wallet?</h2>
            <p>
              Ajukan klaim tokenisasi ijazah Anda sekarang untuk mendapatkan
              sertifikat digital yang terverifikasi di blockchain.
            </p>
          </div>

          <button
            onClick={() => navigate("/holder/claim")}
            className="btn btn-white"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <PlusCircle size={18} /> Ajukan Klaim Baru
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <FileText size={24} color="#94a3b8" />
              </div>
              <h3>Total Dokumen</h3>
            </div>
            <div className="value">{documents.length}</div>
          </div>

          <div className="stat-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  background: "rgba(45, 212, 191, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <CheckCircle size={24} color="#2dd4bf" />
              </div>
              <h3 style={{ color: "#2dd4bf" }}>Terverifikasi</h3>
            </div>
            <div className="value" style={{ color: "#2dd4bf" }}>
              {documents.length}
            </div>
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <section>
          <h3 className="section-title">Aset Digital Saya</h3>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : documents.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" style={{ margin: "0 auto" }} />
              <p>ANDA BELUM MEMILIKI SERTIFIKAT DIGITAL</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th width="30%">NAMA DOKUMEN</th>
                    <th width="25%">PENERBIT</th>
                    <th width="20%">TANGGAL</th>
                    <th width="10%">TOKEN ID</th>
                    <th width="15%" style={{ textAlign: "right" }}>
                      AKSI
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index}>
                      {/* 1. Nama Dokumen */}
                      <td style={{ fontWeight: "500", color: "#fff" }}>
                        {doc.program_name || doc.document_type}
                      </td>

                      {/* 2. Penerbit */}
                      <td style={{ color: "#94a3b8" }}>
                        {doc.institution_name || "Institusi Tidak Dikenal"}
                      </td>

                      {/* 3. Tanggal */}
                      <td style={{ color: "#94a3b8" }}>
                        {doc.issue_date
                          ? new Date(doc.issue_date).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>

                      {/* 4. Token ID */}
                      <td
                        style={{
                          fontFamily: "monospace",
                          color: "#2dd4bf",
                          fontWeight: "bold",
                        }}
                      >
                        #{doc.token_id !== undefined ? doc.token_id : "?"}
                      </td>

                      {/* 5. Aksi */}
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                          }}
                        >
                          {/* TOMBOL SHARE / QR */}
                          <button
                            onClick={() => handleOpenShare(doc)}
                            className="btn-white"
                            style={{
                              padding: "0.5rem",
                              borderRadius: "6px",
                              display: "inline-flex",
                              border: "1px solid var(--border-color)",
                              cursor: "pointer",
                            }}
                            title="Bagikan / Tampilkan QR"
                          >
                            <Share2 size={16} />
                          </button>

                          {/* TOMBOL CEK BLOCKCHAIN */}
                          {doc.tx_hash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${doc.tx_hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-white"
                              style={{
                                padding: "0.5rem",
                                borderRadius: "6px",
                                display: "inline-flex",
                                border: "1px solid var(--border-color)",
                              }}
                              title="Cek di Blockchain"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}

                          {/* TOMBOL DOWNLOAD */}
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-white"
                              style={{
                                padding: "0.5rem",
                                borderRadius: "6px",
                                display: "inline-flex",
                                border: "1px solid var(--border-color)",
                              }}
                              title="Unduh File"
                            >
                              <Download size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* --- MODAL SHARE --- */}
        {showShareModal && selectedDocForShare && (
          <div className="modal-overlay">
            <div className="modal-content animate-fadeIn">
              <div className="modal-header">
                <h3>Bagikan Kredensial</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                  Scan QR Code ini untuk memverifikasi keaslian dokumen di
                  Blockchain.
                </p>

                <div
                  style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: "12px",
                    display: "inline-block",
                    marginBottom: "1.5rem",
                  }}
                >
                  <QRCode
                    value={`${window.location.origin}/verify/${selectedDocForShare.credential_id}`}
                    size={200}
                  />
                </div>

                <div className="input-group-copy">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/verify/${selectedDocForShare.credential_id}`}
                  />
                  <button onClick={handleCopyLink}>
                    <Copy size={16} /> Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HolderDashboard;
