import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminStyles.css";

const AdminDashboard = () => {
  const [issuers, setIssuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch Data Penerbit
  const fetchIssuers = async () => {
    try {
      const response = await axios.get("/admin/issuers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssuers(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data issuer", error);
      if (error.response && error.response.status === 401) {
        logout(); // Token expired
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    // Konfirmasi ganda agar tidak salah hapus
    if (
      !window.confirm(
        `Yakin ingin menghapus akun penerbit "${name}"? Tindakan ini permanen.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/admin/delete-issuer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Akun berhasil dihapus.");
      fetchIssuers(); // Refresh data tabel otomatis
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus akun.");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchIssuers();
    } else {
      navigate("/admin/login");
    }
  }, [user]);

  // Fungsi Approve
  const handleApprove = async (id) => {
    if (!window.confirm("Setujui akun penerbit ini?")) return;

    try {
      await axios.post(
        `/admin/approve-issuer/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Akun berhasil diaktifkan!");
      fetchIssuers(); // Refresh list
    } catch (error) {
      alert("Gagal menyetujui akun.");
    }
  };

  // Pisahkan Pending dan Active
  const pendingIssuers = issuers.filter((i) => i.status === "pending_approval");
  const activeIssuers = issuers.filter((i) => i.status === "active");

  return (
    <div className="admin-dashboard">
      {/* ... Navbar ... */}

      <main className="admin-content">
        <h1>Dashboard Pengelolaan Institusi</h1>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            {/* TABEL 1: PENDING */}
            <section className="dashboard-section">
              <h3>⏳ Menunggu Persetujuan ({pendingIssuers.length})</h3>
              <table className="admin-table">
                {/* ... thead ... */}
                <tbody>
                  {pendingIssuers.map((issuer) => (
                    <tr key={issuer.user_id}>
                      <td>{issuer.full_name}</td>
                      <td>{issuer.email}</td>
                      <td>
                        {new Date(issuer.created_at).toLocaleDateString()}
                      </td>
                      <td className="action-cell">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(issuer.user_id)}
                        >
                          ✅ Setujui
                        </button>
                        {/* Tombol Hapus (Tolak) */}
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(issuer.user_id, issuer.full_name)
                          }
                        >
                          🗑️ Tolak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* TABEL 2: ACTIVE */}
            <section className="dashboard-section">
              <h3>✅ Penerbit Aktif ({activeIssuers.length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Aksi</th> {/* Tambah kolom Aksi */}
                  </tr>
                </thead>
                <tbody>
                  {activeIssuers.map((issuer) => (
                    <tr key={issuer.user_id}>
                      <td>{issuer.full_name}</td>
                      <td>{issuer.email}</td>
                      <td>
                        <span className="badge-active">Active</span>
                      </td>
                      <td>
                        {/* Tombol Hapus */}
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(issuer.user_id, issuer.full_name)
                          }
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
