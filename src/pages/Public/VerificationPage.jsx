import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  Download,
  Blocks,
} from "lucide-react";

import "./VerificationStyles.css";

const VerificationPage = () => {
  const { id } = useParams();
  const [verifyData, setVerifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const response = await axios.get(`/credentials/verify/${id}`);
        setVerifyData(response.data);
      } catch (err) {
        console.error("Verification Error:", err);
        setError("Dokumen tidak ditemukan atau ID tidak valid.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVerification();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="verify-page">
        <div className="verify-state">
          <div className="spinner"></div>
          <p style={{ color: "#94a3b8" }}>Memverifikasi keaslian dokumen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-page">
        <div className="verify-state">
          <XCircle size={64} color="#ef4444" style={{ marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
            Verifikasi Gagal
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "300px" }}>{error}</p>
          <p
            style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2rem" }}
          >
            VeriChain Verification System
          </p>
        </div>
      </div>
    );
  }

  const { data, blockchain } = verifyData;

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <div className="verify-icon-wrapper">
              <ShieldCheck size={32} color="#ffffff" />
            </div>
            <h1>Dokumen Terverifikasi</h1>
            <p>Valid & Tercatat di Blockchain</p>
          </div>

          <div className="verify-body">
            <div
              className="info-group"
              style={{ textAlign: "center", marginBottom: "2rem" }}
            >
              <span className="info-label">Diberikan Kepada</span>
              <div className="info-value" style={{ fontSize: "1.5rem" }}>
                {data.recipient_name}
              </div>
              <span className="info-sub">NIM: {data.recipient_nim || "-"}</span>
            </div>

            <div className="info-grid">
              <div className="info-group">
                <span className="info-label">Jenis Dokumen</span>
                <div className="info-value">{data.document_type}</div>
              </div>
              <div className="info-group">
                <span className="info-label">Tanggal Terbit</span>
                <div className="info-value">
                  {new Date(data.issue_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="info-group">
              <span className="info-label">Program / Sertifikasi</span>
              <div className="info-value">{data.program_name}</div>
            </div>

            <div className="info-group">
              <span className="info-label">Penerbit</span>
              <div
                className="info-value"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CheckCircle2 size={16} color="#2dd4bf" />
                {data.institution_name}
              </div>
            </div>

            <div className="blockchain-proof">
              <div className="proof-header">
                <Blocks size={18} />
                BUKTI DIGITAL (ON-CHAIN)
              </div>

              <div className="proof-row">
                <span>Token ID</span>
                <span className="proof-code">#{blockchain.tokenId}</span>
              </div>

              <div className="proof-row">
                <span>Status</span>
                <span style={{ color: "#2dd4bf", fontWeight: "bold" }}>
                  CLAIMED / VALID
                </span>
              </div>

              <div className="proof-row">
                <span>Tx Hash</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${blockchain.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hash-link"
                >
                  {blockchain.txHash.substring(0, 10)}...
                  {blockchain.txHash.substring(blockchain.txHash.length - 4)}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="verify-footer">
          <p>© 2026 VeriChain. Validasi Real-time Blockchain.</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
