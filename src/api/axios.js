import axios from "axios";

// Di file src/api/axios.js (Frontend)
const BASE_URL = "http://localhost:3001/api"; // <--- Pastikan portnya 3001

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Instance khusus untuk request yang butuh Token (Private)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
