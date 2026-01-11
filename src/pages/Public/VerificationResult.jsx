// pages/Public/VerificationResult.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader,
  ShieldCheck,
  Building,
} from "lucide-react";

const VerificationResult = ({ id, onBack }) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, valid, invalid, error

  useEffect(() => {
    const verifyDoc = async () => {
      try {
        // Panggil endpoint verify
        const response = await axios.get(`/credentials/verify/${id}`);

        // Simulasikan delay sedikit agar terasa proses verifikasinya
        setTimeout(() => {
          // response.data.data berisi row dari database
          setData(response.data.data);
          setStatus("valid");
        }, 1500);
      } catch (err) {
        console.error("Verification Error:", err);
        setStatus("invalid");
      }
    };

    if (id) verifyDoc();
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center mt-20 animate-fadeIn">
        <Loader size={48} className="text-teal-400 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-white">
          Memverifikasi di Blockchain...
        </h3>
        <p className="text-gray-400">Menghubungi Smart Contract & IPFS</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="text-center mt-20 animate-fadeIn">
        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Verifikasi Gagal</h2>
        <p className="text-gray-400 mt-2">
          Dokumen tidak ditemukan atau ID tidak valid.
        </p>
        <button onClick={onBack} className="mt-6 text-teal-400 hover:underline">
          Coba cari ulang
        </button>
      </div>
    );
  }

  // --- TAMPILAN SUKSES ---
  return (
    <div className="max-w-2xl mx-auto mt-6 bg-[#0f172a] border border-teal-900 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
      {/* Header Hijau */}
      <div className="bg-teal-700/20 border-b border-teal-800 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500"></div>
        <div className="inline-block p-3 rounded-full bg-teal-500/10 mb-3">
          <CheckCircle size={32} className="text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Dokumen Terverifikasi</h1>
        <p className="text-teal-200 text-sm">Valid & Tercatat di Blockchain</p>
      </div>

      {/* Konten Data */}
      <div className="p-8 space-y-6">
        {/* Nama Penerima */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            Diberikan Kepada
          </p>
          {/* Ubah student_name menjadi recipient_name */}
          <h2 className="text-3xl font-bold text-white">
            {data.recipient_name}
          </h2>

          {/* Logika Tampilan: Jika ada NIM pakai NIM, jika tidak pakai Serial Number */}
          <p className="text-gray-400 mt-1 font-mono text-sm">
            {data.recipient_nim
              ? `NIM: ${data.recipient_nim}`
              : `No. Seri: ${data.serial_number || "-"}`}
          </p>
        </div>

        {/* Grid Informasi Detail */}
        <div className="grid grid-cols-2 gap-6 border-t border-gray-800 pt-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">
              Jenis Dokumen / Program
            </p>
            {/* Tampilkan Program Name jika ada, jika null tampilkan Document Type */}
            <p className="font-semibold text-white mt-1">
              {data.program_name || data.document_type}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">Tanggal Terbit</p>
            <p className="font-semibold text-white mt-1">
              {new Date(data.issue_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Informasi Penerbit (Institusi) - Tambahan agar lengkap */}
        <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
          <div className="p-2 bg-gray-700 rounded-full">
            <Building size={18} className="text-gray-300" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Penerbit</p>
            <p className="text-white font-medium">
              {data.institution_name || "Institusi Terverifikasi"}
            </p>
          </div>
        </div>

        {/* Kotak Bukti On-Chain */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mt-4">
          <h4 className="text-teal-400 text-sm font-bold flex items-center gap-2 mb-3">
            <ShieldCheck size={16} /> BUKTI DIGITAL (ON-CHAIN)
          </h4>

          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Token ID</span>
            <span className="font-mono text-teal-200 bg-teal-900/30 px-2 py-0.5 rounded">
              #{data.token_id}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Tx Hash</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${data.tx_hash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm truncate max-w-[200px]"
            >
              {data.tx_hash ? `${data.tx_hash.substring(0, 10)}...` : "-"}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 text-center">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cari Dokumen Lain
        </button>
      </div>
    </div>
  );
};

export default VerificationResult;
