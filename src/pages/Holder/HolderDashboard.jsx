import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./HolderStyles.css";
import {
  Wallet,
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
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (user && user.role !== "student") {
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
        setDocuments(response.data);
      } catch (err) {
        console.error("Gagal mengambil dokumen:", err);

        setDocuments([
          {
            id: 1,
            title: "Sertifikat Kompetensi Blockchain",
            issuer: "Badan Nasional Sertifikasi Profesi",
            issue_date: "2026-01-05",
            tx_hash: "0x123abc...",
            token_id: "105",
            file_url: "#",
          },
          {
            id: 2,
            title: "Ijazah Sarjana Komputer",
            issuer: "Universitas Teknologi Digital",
            issue_date: "2025-12-20",
            tx_hash: "0x456def...",
            token_id: "99",
            file_url: "#",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDocuments();
  }, [user]);

  const connectWallet = () => {
    setWalletAddress("0x71C...9A21");
  };

  if (!user) return null;

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                background: "#eff6ff",
                padding: "0.75rem",
                borderRadius: "50%",
                color: "var(--primary-color)",
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Total Dokumen
              </h3>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {documents.length}
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                background: "#ecfdf5",
                padding: "0.75rem",
                borderRadius: "50%",
                color: "#059669",
              }}
            >
              <CheckCircle size={24} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Terverifikasi
              </h3>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                {documents.length}
              </div>
            </div>
          </div>
        </div>

        <section>
          <h3 className="section-title">Aset Digital Saya</h3>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : documents.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <p className="form-label" style={{ fontSize: "1.1rem" }}>
                Anda belum memiliki sertifikat digital
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        NAMA DOKUMEN
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        PENERBIT
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        TANGGAL
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        TOKEN ID
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "right",
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        AKSI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        <td style={{ padding: "1rem", fontWeight: "500" }}>
                          {doc.title}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {doc.issuer}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {new Date(doc.issue_date).toLocaleDateString("id-ID")}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            fontFamily: "monospace",
                            color: "var(--primary-color)",
                          }}
                        >
                          #{doc.token_id}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "0.5rem",
                            }}
                          >
                            <a
                              href={`https://sepolia.etherscan.io/tx/${doc.tx_hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-white"
                              style={{
                                padding: "0.5rem",
                                display: "inline-flex",
                              }}
                              title="Cek di Blockchain"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <a
                              href={doc.file_url}
                              className="btn-white"
                              style={{
                                padding: "0.5rem",
                                display: "inline-flex",
                              }}
                              title="Unduh File"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HolderDashboard;
