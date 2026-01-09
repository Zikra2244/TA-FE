const jwt = require("jsonwebtoken");
require("dotenv").config();

// 1. FUNGSI VERIFY TOKEN (Kode Asli Anda)
const verifyToken = (req, res, next) => {
  // 1. Ambil header Authorization
  const authHeader = req.headers["authorization"];

  // 2. Cek apakah header ada
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Header otentikasi tidak ditemukan." });
  }

  // 3. Ambil tokennya saja (buang kata "Bearer ")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    // 4. Verifikasi Token menggunakan JWT_SECRET dari .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Simpan data user (payload) ke req.user agar bisa dipakai di Controller
    req.user = verified;

    console.log(
      `[AUTH] User terverifikasi: ${req.user.email} (Role: ${req.user.role})`
    );

    next(); // Lanjut ke Controller
  } catch (err) {
    console.error("[AUTH ERROR]", err.message);
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa." });
  }
};

// 2. FUNGSI AUTHORIZE ROLE (Tambahan Wajib untuk Dashboard)
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Pastikan req.user ada (berarti sudah lolos verifyToken)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses terlarang. Role Anda tidak diizinkan.",
      });
    }
    next();
  };
};

// 3. EXPORT SEBAGAI OBJECT (PENTING)
// Agar bisa di-import sebagian-sebagian di route
module.exports = { verifyToken, authorizeRole };
