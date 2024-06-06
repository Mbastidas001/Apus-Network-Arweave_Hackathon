import React from "react";
import styles from "../styles/Header.module.css";
import { Inika } from "next/font/google";
import { useLogin } from "../arweave_util/wallet";

const inika = Inika({ subsets: ["latin"], weight: ["400", "700"] });

const Header = () => {
  const { login, logout, activeAddress } = useLogin();

  const handleLogin = async () => {
    if (activeAddress) {
      await logout();
    } else {
      await login();
    }
  };

  const getButtonText = () => {
    if (activeAddress) {
      const startChars = activeAddress.slice(0, 3);
      const endChars = activeAddress.slice(-3);
      return `${startChars}...${endChars}`;
    } else {
      return "Login";
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoTitle}>
        <div className={styles.titleContainer}>
          <h1>DEMO @ ARWEAVE HACKATHON </h1>
        </div>
      </div>
      <button
        className={`${styles.loginButton} ${inika.className}`}
        onClick={handleLogin}
      >
        {getButtonText()}
      </button>
    </header>
  );
};

export default Header;
