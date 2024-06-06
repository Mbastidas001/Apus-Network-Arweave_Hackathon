"use client";

import Image from "next/image";
import React from "react";
import { Button } from "antd";
import { useEffect, useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the message from the API route
    fetch("/api/prompt")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="App">
      <Button type="primary">Generate Image</Button>
    </div>
  );
};

export default Home;
