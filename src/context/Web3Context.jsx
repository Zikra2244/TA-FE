import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

// Pastikan file config ini sudah ada dan benar path-nya
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/config";

export const Web3Context = createContext();

const { ethereum } = window;

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [academicNftContract, setAcademicNftContract] = useState(null);

  // --- 1. PERBAIKAN: Fungsi Helper dibuat ASYNC ---
  // Di Ethers v6, provider.getSigner() itu async, jadi harus pakai await
  const getEthereumContract = async () => {
    if (!ethereum) return null;

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      // PERBAIKAN UTAMA DI SINI: tambahkan 'await'
      const signer = await provider.getSigner(); 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      console.log("Kontrak berhasil dimuat:", contract);
      return contract;
    } catch (error) {
      console.error("Gagal load contract:", error);
      return null;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return; // Jangan alert di sini agar tidak mengganggu UX saat load pertama

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);

        // Load contract jika akun terdeteksi
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
      
      // Request akses akun
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      setCurrentAccount(accounts[0]);

      // Setelah connect, langsung load contract
      const contract = await getEthereumContract();
      setAcademicNftContract(contract);
      
      // Opsional: Reload halaman agar state bersih (tergantung preferensi)
      // window.location.reload(); 

    } catch (error) {
      console.error(error);
      throw new Error("Gagal menghubungkan wallet");
    } finally {
      setIsLoading(false);
    }
  };

  // Event Listener: Deteksi jika user ganti akun di MetaMask
  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          const contract = await getEthereumContract();
          setAcademicNftContract(contract);
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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};