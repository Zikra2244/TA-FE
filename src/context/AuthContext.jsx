import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inisialisasi state LANGSUNG dari localStorage agar tidak null saat refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false); // Tambah loading state jika perlu

  // Register
  const register = async (fullName, email, password, role) => {
    try {
      const response = await axios.post("/auth/register", {
        full_name: fullName,
        email: email,
        password: password,
        role: role,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });

      const { user, token } = response.data;

      // Simpan ke State
      setUser(user);
      setToken(token);

      // Simpan ke LocalStorage
      localStorage.setItem("user_data", JSON.stringify(user));
      localStorage.setItem("token", token);

      return user; // <--- UBAH INI: Mengembalikan objek user (agar role bisa dibaca)
    } catch (error) {
      console.error("Login Gagal:", error);
      throw error.response ? error.response.data : new Error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
