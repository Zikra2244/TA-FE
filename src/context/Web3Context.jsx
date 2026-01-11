import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/config";

export const Web3Context = createContext();

const { ethereum } = window;

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [academicNftContract, setAcademicNftContract] = useState(null);

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

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);

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
