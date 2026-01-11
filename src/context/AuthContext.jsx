import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

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

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });

      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      localStorage.setItem("user_data", JSON.stringify(user));
      localStorage.setItem("token", token);

      return user;
    } catch (error) {
      console.error("Login Gagal:", error);
      throw error.response ? error.response.data : new Error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

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
