import React from "react";
import "./LandingPage.css";
import PublicNavbar from "../../components/PublicNavbar/PublicNavbar";
import PublicFooter from "../../components/PublicFooter/PublicFooter";

// Anda bisa ganti URL gambar ini nanti
const heroImageUrl =
  "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjUyOXwwfDF8c2VhcmNofDE4fHxhYnN0cmFjdCUyMGJsdWV8ZW58MHx8fHwxNzMxNTU5MzcyfDA&ixlib=rb-4.0.3&q=80&w=1080";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <PublicNavbar />

      {/* Hero Section */}
      <header
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImageUrl})`,
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Verifikasi Ijazah Masa Depan.</h1>
          <h2 className="hero-subtitle">
            Tokenisasi Aset Akademik Anda sebagai Real-World Asset (RWA) di
            Blockchain.
          </h2>
          <p className="hero-description">
            Buktikan keaslian, integritas, dan kepemilikan digital (provable
            ownership) ijazah dan sertifikat Anda secara aman dan transparan.
          </p>
          <div className="hero-cta">
            <button className="cta-primary">Mulai Verifikasi Publik</button>
            <button className="cta-secondary">Masuk / Daftar</button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Mengapa Menggunakan VeriChain?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔒 Aman & Terdesentralisasi</h3>
            <p>
              Dibangun di atas Jaringan Ethereum, menjamin data tidak dapat
              diubah (immutable) dan terlindungi kriptografi.
            </p>
          </div>
          <div className="feature-card">
            <h3>✅ Dapat Dibuktikan (Provable)</h3>
            <p>
              Setiap dokumen adalah NFT unik (ERC-721), memberikan bukti
              kepemilikan digital yang sah dan tidak terbantahkan.
            </p>
          </div>
          <div className="feature-card">
            <h3>🌍 Terverifikasi Global</h3>
            <p>
              Verifikasi instan oleh siapa saja, di mana saja, kapan saja, tanpa
              perlu bergantung pada perantara institusi.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">Hanya 3 Langkah Sederhana</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Penerbitan (Minting)</h4>
            <p>
              Institusi menerbitkan ijazah sebagai NFT ke dompet treasury aman
              yang dikelola sistem.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Klaim (Claim)</h4>
            <p>
              Mahasiswa melakukan verifikasi 3-faktor untuk mengklaim NFT ke
              dompet Metamask pribadi mereka.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Verifikasi (Verify)</h4>
            <p>
              Pihak ketiga (perusahaan, dll) memverifikasi keaslian aset secara
              publik dan instan via platform.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;
