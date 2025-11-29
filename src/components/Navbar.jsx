import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

const Navbar = () => {
  const { connectWallet, currentAccount, isLoading } = useContext(Web3Context);

  return (
    <nav
      style={{
        padding: "20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h1>Sistem Verifikasi Ijazah</h1>

      {!currentAccount ? (
        <button
          onClick={connectWallet}
          style={{ padding: "10px 20px", cursor: "pointer" }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Hubungkan Wallet"}
        </button>
      ) : (
        <div
          style={{
            border: "1px solid green",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {/* Menampilkan alamat wallet yang dipotong */}
          Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
