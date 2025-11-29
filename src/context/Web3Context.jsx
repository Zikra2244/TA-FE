import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

// 1. IMPORT PETA DAN ALAMAT KONTRAK
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/config";

export const Web3Context = createContext();

const { ethereum } = window;

// --- Fungsi Helper untuk membuat instansi kontrak ---
const getEthereumContract = () => {
  // Pengecekan provider baru yang lebih modern
  const provider = new ethers.BrowserProvider(ethereum);

  // Signer adalah objek yang mewakili akun pengguna (Account #0 Anda)
  // Kita butuh signer untuk mengirim transaksi (write)
  const signer = provider.getSigner();

  // Ini adalah objek kontrak yang siap diajak bicara
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // Kita kembalikan versi yang terhubung dengan Signer (untuk write)
  // dan versi yang hanya terhubung ke Provider (untuk read-only)
  // (Meskipun untuk saat ini kita pakai signer untuk semua)
  return contract;
};
// ---------------------------------------------------

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. STATE BARU UNTUK MENYIMPAN OBJEK KONTRAK
  const [academicNftContract, setAcademicNftContract] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Mohon install Metamask!");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);

        // 3. JIKA SUDAH TERHUBUNG, LANGSUNG BUAT OBJEK KONTRAK
        const contract = await getEthereumContract();
        setAcademicNftContract(contract);
      } else {
        console.log("Tidak ada akun yang ditemukan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Mohon install Metamask!");

      setIsLoading(true);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);

      // 4. SETELAH KONEK, LANGSUNG BUAT OBJEK KONTRAK
      const contract = await getEthereumContract();
      setAcademicNftContract(contract);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      throw new Error("Gagal menghubungkan wallet");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        academicNftContract, // 5. BAGIKAN KONTRAK KE SELURUH APLIKASI
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
