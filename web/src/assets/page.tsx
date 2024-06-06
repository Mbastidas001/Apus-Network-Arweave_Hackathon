"use client";

import Image from "next/image";
import React from "react";
import { Button } from "antd";
import Header from "../components/Header";
import { useEffect, useState, FormEvent } from "react";
import { ArweaveWalletKit } from "arweave-wallet-kit";

const Home = () => {
  const [base64Image, setBase64Image] = useState("");
  const queryParams = new URLSearchParams({
    prompt:
      "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme",
  }).toString();

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`/api/prompt?${queryParams}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBase64Image(data.image); // Assuming the response has a field 'image' that contains the base64 string
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <ArweaveWalletKit
      config={{
        permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
      }}
    >
    <div
      className="App"
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
    >
      {base64Image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
            maxWidth: "512px",
          }}
        >
          <Image
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Generated"
            layout="responsive"
            width={512}
            height={512}
            objectFit="contain"
          />
        </div>
      )}
      <Header/>
      <Button
        type="primary"
        onClick={handleButtonClick}
        style={{ marginTop: "20px" }}
      >
        Generate Image
      </Button>
    </div>
    </ArweaveWalletKit>
  );
};

export default Home;
