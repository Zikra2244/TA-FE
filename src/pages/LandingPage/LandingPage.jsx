import React, { useState, useEffect, useRef, useContext } from "react";
import "./LandingPage.css";
import Navbar from "../../components/Navbar/Navbar";
import PublicFooter from "../../components/PublicFooter/PublicFooter";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const { user } = useContext(AuthContext);

  const getDashboardPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "issuer":
        return "/issuer/dashboard";
      case "owner":
        return "/dashboard";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (cardRef.current) {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div className="landing-page">
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <Navbar />

      <header className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Live on Sepolia Testnet
            </div>

            <h1 className="hero-title">
              The Future of <br />
              <span className="gradient-text">Academic Proof.</span>
            </h1>

            <p className="hero-subtitle">
              Platform tokenisasi ijazah berbasis Blockchain. Ubah dokumen fisik
              menjadi <b>Real-World Asset (RWA)</b> yang abadi, aman, dan
              transparan.
            </p>

            <div className="hero-cta">
              <Link to="/verify" className="btn-primary-glow">
                Mulai Verifikasi
              </Link>

              {user ? (
                <Link
                  to={getDashboardPath(user.role)}
                  className="btn-secondary-glass"
                >
                  Ke Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary-glass">
                  Masuk Platform
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual" onMouseLeave={handleMouseLeave}>
            <div className="holo-card-container" ref={cardRef}>
              <div className="holo-card-inner">
                <div className="card-shine"></div>

                <div className="card-content">
                  <div className="card-header">
                    <span className="card-pill">OFFICIAL</span>
                    <span className="card-icon">🎓</span>
                  </div>

                  <div className="card-body">
                    <h3>Credential NFT</h3>
                    <div className="card-chip"></div>

                    <div className="code-lines">
                      <div className="line l1"></div>
                      <div className="line l2"></div>
                      <div className="line l3"></div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="hash-code">0x71C...9A21</div>
                    <div className="status-indicator">VALID</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">
            Keunggulan <span className="text-highlight">Teknologi</span>
          </h2>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-glow"></div>
              <div className="icon-box">🔒</div>
              <h3>Imutabilitas Total</h3>
              <p>
                Data tersimpan abadi di Blockchain Ethereum. Tidak dapat diubah,
                dihapus, atau dimanipulasi oleh pihak manapun.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-glow"></div>
              <div className="icon-box">💎</div>
              <h3>Kepemilikan Penuh</h3>
              <p>
                Mahasiswa memegang kendali penuh atas aset digital (NFT) di
                dompet pribadi mereka, bukan di server kampus.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-glow"></div>
              <div className="icon-box">⚡</div>
              <h3>Verifikasi Instan</h3>
              <p>
                Perusahaan dapat memverifikasi keaslian ijazah secara real-time,
                global, dan tanpa perantara pihak ketiga.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="section-title">Cara Kerja Sistem</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Penerbitan</h4>
            <p>
              Institusi mencetak ijazah digital yang diamankan secara
              kriptografis oleh Smart Contract.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Klaim Aset</h4>
            <p>
              Mahasiswa mengklaim kepemilikan ijazah ke dompet digital
              (Metamask) melalui otentikasi aman.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Verifikasi</h4>
            <p>
              Publik memverifikasi keaslian dokumen secara instan menggunakan ID
              unik yang transparan.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;
