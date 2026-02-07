import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

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
      if (!token) return; // Jika belum login, skip

      // Ganti URL sesuai port backend Anda (biasanya 3001)
      const response = await fetch(
        "http://localhost:3001/api/users/profile/wallet",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ walletAddress }),
        }
      );

      const data = await response.json();
      console.log("[Web3] Sync Wallet Success:", data.message);
    } catch (error) {
      console.error("[Web3] Gagal sinkronisasi wallet ke backend:", error);
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
      setCurrentAccount(account);

      // 2. [PENTING] Kirim Alamat ke Backend (Pemicu Auto-Faucet)
      await syncWalletToBackend(account);

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
          setCurrentAccount(accounts[0]);
          // Sync backend jika user ganti akun di metamask
          syncWalletToBackend(accounts[0]);

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
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
