import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar/Navbar";
import VerificationResult from "./VerificationResult";
import "./PublicStyles.css"; // Pastikan CSS diimport

// Import Icons dari Lucide React
import {
  Search,
  ShieldCheck,
  User,
  Building,
  FileText,
  ArrowRight,
  Lock,
  GraduationCap,
  Award,
  ChevronLeft,
} from "lucide-react";

const PublicVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1: Pilih Tipe, 2: Form, 3: Challenge, 4: Result
  const [searchType, setSearchType] = useState(""); // 'ijazah' | 'sertifikat'

  // State Form Pencarian
  const [formData, setFormData] = useState({
    name: "",
    institutionId: "1", // Default value
    docType: "",
  });

  // State Proses Verifikasi
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [secretInput, setSecretInput] = useState(""); // Input User (NIM/No Seri)
  const [verifiedId, setVerifiedId] = useState(null); // ID Final untuk ditampilkan

  // 1. DETEKSI DIRECT LINK (QR Code)
  useEffect(() => {
    if (id) {
      setVerifiedId(id);
      setStep(4); // Langsung ke hasil
    }
  }, [id]);

  // 2. LOGIC PENCARIAN (Ke Backend)
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get("/credentials/public/search", {
        params: {
          category: searchType,
          name: formData.name,
          institutionId: formData.institutionId,
          docType: formData.docType,
        },
      });

      setCandidates(response.data);
      setStep(3); // Pindah ke pemilihan kandidat
    } catch (err) {
      alert("Data tidak ditemukan atau kriteria pencarian kurang spesifik.");
    } finally {
      setLoading(false);
    }
  };

  // 3. LOGIC VALIDASI RAHASIA (Challenge)
  const handleVerifySecret = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim ID Dokumen + Inputan Rahasia User ke Backend
      const response = await axios.post("/credentials/public/validate", {
        credential_id: selectedCandidate.credential_id,
        secret_input: secretInput,
      });

      if (response.data.isValid) {
        navigate(`/verify/${selectedCandidate.credential_id}`);
      } else {
        alert("Verifikasi Gagal: Nomor Identitas tidak cocok.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER FUNCTIONS ---

  // STEP 1: PILIH TIPE DOKUMEN
  const renderTypeSelection = () => (
    <div className="animate-fadeIn">
      <div className="selection-header">
        <h2 className="text-3xl font-bold text-white mb-2">
          Verifikasi Dokumen
        </h2>
        <p className="text-gray-400">
          Pilih jenis dokumen yang ingin Anda validasi keasliannya
        </p>
      </div>

      <div className="selection-grid">
        {/* KARTU IJAZAH */}
        <div
          onClick={() => {
            setSearchType("ijazah");
            setStep(2);
          }}
          className="selection-card card-ijazah"
        >
          <div className="icon-wrapper bg-teal-soft">
            <GraduationCap size={32} className="text-teal" />
          </div>
          <h3 className="text-xl font-bold text-white text-center">
            Cari Ijazah
          </h3>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Verifikasi data kelulusan akademik berdasarkan Nama Lengkap dan NIM.
          </p>
        </div>

        {/* KARTU SERTIFIKAT */}
        <div
          onClick={() => {
            setSearchType("sertifikat");
            setStep(2);
          }}
          className="selection-card card-sertifikat"
        >
          <div className="icon-wrapper bg-purple-soft">
            <Award size={32} className="text-purple" />
          </div>
          <h3 className="text-xl font-bold text-white text-center">
            Cari Sertifikat / Lainnya
          </h3>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Verifikasi sertifikat kompetensi, SKPI, atau piagam penghargaan
            lainnya.
          </p>
        </div>
      </div>
    </div>
  );

  // STEP 2: FORM PENCARIAN
  const renderSearchForm = () => (
    <div className="search-card animate-fadeIn">
      <button onClick={() => setStep(1)} className="back-button">
        <ChevronLeft size={18} /> Ganti Kategori
      </button>

      <div className="search-header">
        {searchType === "ijazah" ? (
          <GraduationCap size={48} className="text-teal mx-auto mb-4" />
        ) : (
          <Award size={48} className="text-purple mx-auto mb-4" />
        )}
        <h2 className="text-2xl font-bold text-white">
          Cari {searchType === "ijazah" ? "Ijazah" : "Sertifikat"}
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Masukkan informasi pemilik dokumen untuk memulai pencarian.
        </p>
      </div>

      <form onSubmit={handleSearch}>
        {/* Input Nama */}
        <div className="input-wrapper">
          <label className="input-label">Nama Lengkap</label>
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input
              className="form-input"
              type="text"
              placeholder="Contoh: Muhammad Zikra..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Input Institusi */}
        <div className="input-wrapper">
          <label className="input-label">Institusi Penerbit</label>
          <div className="input-group">
            <Building className="input-icon" size={18} />
            <select
              className="form-select"
              value={formData.institutionId}
              onChange={(e) =>
                setFormData({ ...formData, institutionId: e.target.value })
              }
            >
              <option value="1">Telkom University</option>
              <option value="2">Institut Teknologi Bandung</option>
              {/* Tambahkan opsi lain sesuai database */}
            </select>
          </div>
        </div>

        {/* Input Jenis Dokumen (Hanya Sertifikat) */}
        {searchType === "sertifikat" && (
          <div className="input-wrapper animate-fadeIn">
            <label className="input-label">Jenis Dokumen</label>
            <div className="input-group">
              <FileText className="input-icon" size={18} />
              <input
                className="form-input"
                type="text"
                placeholder="Contoh: Sertifikat Kompetensi, TOEFL..."
                value={formData.docType}
                onChange={(e) =>
                  setFormData({ ...formData, docType: e.target.value })
                }
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary mt-6" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              Lanjutkan Pencarian <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );

  // STEP 3: CHALLENGE (Pilih Kandidat & Input Rahasia)
  const renderChallengeStep = () => (
    <div className="animate-fadeIn max-w-2xl mx-auto mt-8">
      <button
        onClick={() => {
          setStep(2);
          setSelectedCandidate(null);
        }}
        className="back-button mb-6"
      >
        <ChevronLeft size={18} /> Kembali ke Form
      </button>

      {!selectedCandidate ? (
        /* 3A. LIST KANDIDAT */
        <div className="candidate-list-container">
          <h2 className="text-2xl font-bold text-white mb-2">
            Hasil Pencarian
          </h2>
          <p className="text-gray-400 mb-6">
            Ditemukan {candidates.length} data yang cocok. Pilih salah satu
            untuk verifikasi lanjut.
          </p>

          {candidates.length === 0 ? (
            <div className="text-center bg-gray-800 p-8 rounded-xl border border-gray-700">
              <p className="text-gray-400">
                Data tidak ditemukan. Periksa ejaan nama kembali.
              </p>
            </div>
          ) : (
            candidates.map((cand, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCandidate(cand);
                  setSecretInput("");
                }}
                className="candidate-item"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {cand.student_name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {searchType === "ijazah" ? "Prodi:" : "Dokumen:"}{" "}
                    <span className="text-gray-300">{cand.display_info}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    ID Terdaftar
                  </p>
                  <span className="candidate-masked-badge">
                    {cand.masked_id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* 3B. INPUT RAHASIA (NIM/NO SERI) */
        <div className="search-card animate-fadeIn">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-teal" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Verifikasi Identitas
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Dokumen atas nama{" "}
              <strong>{selectedCandidate.student_name}</strong> dilindungi.
              Masukkan nomor identitas lengkap untuk membuka.
            </p>
          </div>

          <form onSubmit={handleVerifySecret}>
            <div className="input-wrapper">
              <label className="input-label text-center">
                Masukkan{" "}
                {searchType === "ijazah"
                  ? "Nomor Induk Mahasiswa (NIM)"
                  : "Nomor Seri Dokumen"}
              </label>
              {/* Note: Class 'secret-input' memberikan efek monospace */}
              <div className="input-group">
                <input
                  className="form-input secret-input"
                  type="text"
                  placeholder={
                    searchType === "ijazah" ? "130322XXXX" : "NO-SERI-XXXX"
                  }
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="btn-secondary flex-1 py-3 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Buka Dokumen"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="public-page">
      <Navbar /> {/* Navbar Publik */}
      <div className="public-container">
        {step === 1 && renderTypeSelection()}
        {step === 2 && renderSearchForm()}
        {step === 3 && renderChallengeStep()}

        {/* STEP 4: Render Component Result Terpisah */}
        {step === 4 && (
          <VerificationResult
            id={verifiedId}
            onBack={() => {
              setStep(1);
              setVerifiedId(null);
              setSelectedCandidate(null);
              setFormData({ ...formData, name: "" }); // Reset form optional
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PublicVerification;
