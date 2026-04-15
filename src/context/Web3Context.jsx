import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "../api/axios";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/config";

export const Web3Context = createContext();

const { ethereum } = window;

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [academicNftContract, setAcademicNftContract] = useState(null);

  // --- FUNGSI HELPER: Panggil Backend ---
  const syncWalletToBackend = async (walletAddress) => {
    try {
      const token = localStorage.getItem("token"); // Ambil JWT Token dari Login
      if (!token) return true; // Jika belum login, abaikan

      const response = await axios.put(
        "/users/profile/wallet",
        { walletAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("[Web3] Sync Wallet Success:", response.data.message);
      return true;
    } catch (error) {
      console.error("[Web3] Gagal sinkronisasi wallet ke backend:", error);
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Gagal memvalidasi wallet di server.");
      }
      return false;
    }
  };
  // -------------------------------------

  const getEthereumContract = async () => {
    if (!ethereum) return null;

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      console.log("Kontrak berhasil dimuat:", contract);
      return contract;
    } catch (error) {
      console.error("Gagal load contract:", error);
      return null;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);

        // Opsional: Sync lagi saat refresh halaman untuk memastikan
        syncWalletToBackend(accounts[0]);

        const contract = await getEthereumContract();
        setAcademicNftContract(contract);
      } else {
        console.log("Tidak ada akun yang terhubung");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Mohon install Metamask!");

      setIsLoading(true);

      // 1. Request ke MetaMask
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      // 2. [PENTING] Kirim Alamat ke Backend untuk validasi
      const isSyncSuccess = await syncWalletToBackend(account);
      
      if (!isSyncSuccess) {
        // Jika sinkronisasi gagal (karena akun sudah terikat wallet lain)
        throw new Error("Validasi wallet ditolak oleh server.");
      }

      // Barulah update antarmuka (UI) jika sukses sinkron ke server
      setCurrentAccount(account);

      // 3. Load Smart Contract
      const contract = await getEthereumContract();
      setAcademicNftContract(contract);
    } catch (error) {
      console.error(error);
      throw new Error("Gagal menghubungkan wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount(null);
    setAcademicNftContract(null);
    console.log("Wallet disconnected from App state");
  };

  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const isSyncSuccess = await syncWalletToBackend(accounts[0]);
          if (isSyncSuccess) {
            setCurrentAccount(accounts[0]);
            const contract = await getEthereumContract();
            setAcademicNftContract(contract);
          } else {
            // Putuskan koneksi UI jika wallet yang ditukar berbeda dari milik backend
            setCurrentAccount(null);
            setAcademicNftContract(null);
          }
        } else {
          setCurrentAccount(null);
          setAcademicNftContract(null);
        }
      });
    }
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        academicNftContract,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
