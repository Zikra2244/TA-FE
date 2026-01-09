import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios"; // Pastikan path axios instance Anda benar
import "./IssuerStyles.css";

const IssuerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. State untuk menyimpan data dari Database
  const [stats, setStats] = useState({
    totalIssued: 0,
    totalPending: 0,
    totalClaimed: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proteksi Halaman: Hanya untuk Issuer
  useEffect(() => {
    if (user && user.role !== "issuer") {
      navigate("/");
    }
  }, [user, navigate]);

  // 2. Fetch Data Dashboard dari Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Jangan fetch jika user belum ter-load atau bukan issuer
      if (!user || user.role !== "issuer") return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/credentials/issuer/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Simpan ke state
        setStats(response.data.stats);
        setHistory(response.data.recentHistory);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  // Cek Status Akun
  const isPending = user.status === "pending_approval";

  return (
    <div className="issuer-dashboard">
      <Navbar />

      <main className="issuer-content">
        {/* HEADER AREA */}
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Dashboard Penerbit</h1>
            <p>
              {user.fullName || user.username} •{" "}
              <span
                className={`status-label ${isPending ? "pending" : "verified"}`}
              >
                {isPending ? "Menunggu Persetujuan" : "Akun Terverifikasi"}
              </span>
            </p>
          </div>

          <div className="header-actions">
            <button
              className="btn-create-new"
              disabled={isPending}
              onClick={() => navigate("/issuer/issue")}
            >
              {isPending ? "Akun Belum Aktif" : "➕ Terbitkan Ijazah Baru"}
            </button>
          </div>
        </div>

        {/* ALERT JIKA PENDING */}
        {isPending && (
          <div className="status-banner">
            <span>⚠️</span>
            <span>
              <strong>Akun Anda sedang ditinjau oleh Admin Institusi.</strong>
              <br />
              Anda belum dapat menerbitkan ijazah sampai akun disetujui.
            </span>
          </div>
        )}

        {/* STATS AREA (DINAMIS) */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Diterbitkan</h3>
            <div className="value">{loading ? "..." : stats.totalIssued}</div>
          </div>
          <div className="stat-card">
            <h3>Menunggu Klaim</h3>
            <div className="value">{loading ? "..." : stats.totalPending}</div>
          </div>
          <div className="stat-card">
            <h3>Sudah Diklaim</h3>
            <div className="value">{loading ? "..." : stats.totalClaimed}</div>
          </div>
        </div>

        {/* TABEL RIWAYAT (DINAMIS) */}
        <section className="history-section">
          <h2>Riwayat Penerbitan Terakhir</h2>

          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              Belum ada ijazah yang diterbitkan.
            </div>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Penerima</th>
                    <th>Jenis Dokumen</th>
                    <th>Tanggal Terbit</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.recipient_name}</strong>
                      </td>
                      <td>{item.document_type}</td>
                      <td>
                        {new Date(item.issue_date).toLocaleDateString("id-ID")}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "claimed"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {item.status === "claimed" ? "Diklaim" : "Menunggu"}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${item.tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="link-blue"
                        >
                          Cek Blockchain ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default IssuerDashboard;
