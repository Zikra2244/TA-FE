import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios"; // Import konfigurasi axios tadi

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Cek login saat refresh halaman
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // 1. FUNGSI REGISTER (Menghubungkan ke Backend)
  const register = async (fullName, email, password, role, institutionName) => {
    try {
      const response = await axios.post("/auth/register", {
        full_name: fullName, // Sesuaikan dengan nama field di database/backend Anda
        email: email,
        password: password,
        role: role,
        institution_name: institutionName,
      });
      return response.data; // Mengembalikan respon sukses
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  // 2. FUNGSI LOGIN (Menghubungkan ke Backend)
  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });

      // Asumsi backend mengembalikan { user: {...}, token: "..." }
      const { user, token } = response.data;

      // Simpan data
      setUser(user);
      setToken(token);
      localStorage.setItem("user_data", JSON.stringify(user));
      localStorage.setItem("token", token);

      return true;
    } catch (error) {
      console.error("Login Gagal:", error);
      throw error.response ? error.response.data : new Error("Login Failed");
    }
  };

  // 3. FUNGSI LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
