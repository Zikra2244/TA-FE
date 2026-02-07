import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./IssuerStyles.css";

const IssuePage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentType: "Ijazah Sarjana",
    recipientName: "",
    recipientNIM: "",
    motherName: "",
    serialNumber: "",
    issueDate: new Date().toLocaleDateString("en-CA"),
    certificationName: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [certRecommendations, setCertRecommendations] = useState([]);

  useEffect(() => {
    const fetchCertTypes = async () => {
      try {
        const response = await axios.get("/credentials/cert-types", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertRecommendations(response.data);
      } catch (err) {
        console.error("Gagal mengambil jenis sertifikasi", err);
      }
    };

    if (token) {
      fetchCertTypes();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCertChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, certificationName: value });
    setShowSuggestions(true);
  };

  const selectSuggestion = (value) => {
    setFormData({ ...formData, certificationName: value });
    setShowSuggestions(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderDynamicFields = () => {
    if (formData.documentType === "Ijazah Sarjana") {
      return (
        <>
          <div className="input-group">
            <label>Nama Pemilik Dokumen</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Nama Lengkap Mahasiswa"
              required
            />
          </div>
          <div className="input-group">
            <label>NISN / NIM</label>
            <input
              type="text"
              name="recipientNIM"
              value={formData.recipientNIM}
              onChange={handleChange}
              placeholder="Contoh: 1301204050"
              required
            />
          </div>
          <div className="input-group">
            <label>Nama Ibu Kandung</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              placeholder="Nama Ibu Kandung"
              required
            />
          </div>
          <div className="input-group">
            <label>Nomor Seri Dokumen (PIN)</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Nomor Seri Unik"
              required
            />
          </div>
        </>
      );
    } else if (formData.documentType.includes("Sertifikat")) {
      return (
        <>
          <div className="input-group">
            <label>Nama Pemilik Dokumen</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Nama Penerima Sertifikat"
              required
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label>Jenis/Nama Sertifikasi</label>
            <input
              type="text"
              name="certificationName"
              value={formData.certificationName}
              onChange={handleCertChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ketik untuk melihat rekomendasi..."
              required
              autoComplete="off"
            />

            {showSuggestions && (
              <ul className="suggestions-list">
                {certRecommendations
                  .filter((item) =>
                    item
                      .toLowerCase()
                      .includes(formData.certificationName.toLowerCase())
                  )
                  .map((item, index) => (
                    <li key={index} onMouseDown={() => selectSuggestion(item)}>
                      {item}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="input-group">
            <label>Nomor Seri Dokumen</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Nomor Sertifikat"
              required
            />
          </div>
        </>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMsg("Mempersiapkan data...");

    if (!token) {
      setError(
        "Error: Anda tidak memiliki akses (Token kosong). Silakan Login ulang."
      );
      setLoading(false);
      return;
    }

    if (!file) {
      setError("Harap unggah file dokumen (PDF).");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      data.append("document_type", formData.documentType);
      data.append("issue_date", formData.issueDate);
      data.append("file", file);
      data.append("recipient_name", formData.recipientName);
      data.append("serial_number", formData.serialNumber);

      if (formData.documentType === "Ijazah Sarjana") {
        data.append("recipient_nim", formData.recipientNIM);
        data.append("mother_name", formData.motherName);
      } else {
        data.append("program_name", formData.certificationName);
      }

      setStatusMsg("Mengunggah & Mencetak NFT...");

      console.log("Mengirim request dengan token:", token);

      await axios.post("/credentials/issue", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Berhasil diterbitkan!");
      navigate("/issuer/dashboard");
    } catch (err) {
      console.error(err);

      const serverMsg = err.response?.data?.message;
      setError(err.response?.data?.message || "Gagal menerbitkan dokumen.");

      if (err.response?.status === 403 || err.response?.status === 401) {
        alert(
          "Sesi Anda telah berakhir atau tidak valid. Silakan Login ulang."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issuer-dashboard">
      <Navbar />
      <main className="issuer-content">
        <div style={{ marginBottom: "2rem" }}>
          <Link to="/issuer/dashboard" className="back-link">
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="issue-card-container">
          <div className="issue-card">
            <div className="form-header">
              <h2>Terbitkan Kredensial Baru</h2>
              <p>Pilih jenis dokumen untuk menampilkan formulir yang sesuai.</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="issue-form">
              <div className="upload-area">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  hidden
                />
                <label
                  htmlFor="file-upload"
                  className={`upload-label ${file ? "has-file" : ""}`}
                >
                  <div className="upload-icon">📄</div>
                  {file ? (
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span>Klik untuk unggah Dokumen</span>
                      <small>Format PDF (Max 5MB)</small>
                    </div>
                  )}
                </label>
              </div>

              <div className="input-group" style={{ marginBottom: "2rem" }}>
                <label style={{ color: "#00BFFF", fontWeight: "bold" }}>
                  Pilih Jenis Dokumen
                </label>
                <div className="select-wrapper">
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({ ...formData, documentType: e.target.value })
                    }
                    style={{ border: "1px solid #00BFFF" }}
                  >
                    <option value="Ijazah Sarjana">🎓 Ijazah Sarjana</option>
                    <option value="Sertifikat Kompetensi">
                      🏅 Sertifikat Kompetensi
                    </option>
                    <option value="Sertifikat Prestasi">
                      🏆 Sertifikat Prestasi
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                {renderDynamicFields()}

                <div className="input-group">
                  <label>Tanggal Terbit</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-issue-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-text">
                      <span className="spinner-small"></span> {statusMsg}
                    </span>
                  ) : (
                    "Terbitkan Dokumen"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssuePage;
