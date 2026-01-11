import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
// import "./IssuerStyles.css";

const IssuerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalIssued: 0,
    totalPending: 0,
    totalClaimed: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "issuer") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || user.role !== "issuer") return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/credentials/issuer/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  const isPending = user.status === "pending_approval";

  return (
    <div className="issuer-dashboard min-h-screen bg-[#0B1120] text-white">
      <Navbar />

      <main className="issuer-content p-6">
        <div className="dashboard-header flex justify-between items-center mb-8">
          <div className="header-title">
            <h1 className="text-2xl font-bold">Dashboard Penerbit</h1>
            <p className="text-gray-400 mt-1">
              {user.fullName || user.username} •{" "}
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded border ${
                  isPending
                    ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                    : "text-green-400 border-green-400/30 bg-green-400/10"
                }`}
              >
                {isPending ? "Menunggu Persetujuan" : "Akun Terverifikasi"}
              </span>
            </p>
          </div>

          <div className="header-actions">
            <button
              className={`px-4 py-2 rounded font-medium transition-colors ${
                isPending
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={isPending}
              onClick={() => navigate("/issuer/issue")}
            >
              {isPending ? "Akun Belum Aktif" : "➕ Mulai Tokenisasi Dokumen"}
            </button>
          </div>
        </div>

        {isPending && (
          <div className="status-banner mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded flex items-center gap-3 text-yellow-200">
            <span className="text-xl">⚠️</span>
            <span className="text-sm">
              <strong>Akun Anda sedang ditinjau oleh Admin Institusi.</strong>
              <br />
              Anda belum dapat menerbitkan ijazah sampai akun disetujui.
            </span>
          </div>
        )}

        <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card bg-[#1E293B] p-5 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">
              Total Diterbitkan
            </h3>
            <div className="value text-2xl font-bold mt-2">
              {loading ? "..." : stats.totalIssued}
            </div>
          </div>
          <div className="stat-card bg-[#1E293B] p-5 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">
              Menunggu Klaim
            </h3>
            <div className="value text-2xl font-bold mt-2 text-yellow-400">
              {loading ? "..." : stats.totalPending}
            </div>
          </div>
          <div className="stat-card bg-[#1E293B] p-5 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Sudah Diklaim</h3>
            <div className="value text-2xl font-bold mt-2 text-green-400">
              {loading ? "..." : stats.totalClaimed}
            </div>
          </div>
        </div>

        <section className="history-section">
          <h2>Riwayat Penerbitan Terakhir</h2>

          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              Belum ada ijazah yang diterbitkan.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Penerima</th>
                    <th style={{ width: "25%" }}>Jenis Dokumen</th>
                    <th style={{ width: "20%" }}>Tanggal</th>
                    <th style={{ width: "15%" }}>Status</th>
                    <th style={{ width: "15%", textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="truncate" title={item.recipient_name}>
                          {item.recipient_name}
                        </span>
                      </td>
                      <td>{item.document_type}</td>
                      <td>
                        {new Date(item.issue_date).toLocaleDateString("id-ID")}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            item.status === "claimed" ? "claimed" : "issued"
                          }`}
                        >
                          {item.status === "claimed" ? "Diklaim" : "Menunggu"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
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
