"use client";
import React, { useState, useEffect } from "react";

export default function AudioPlayer({ url }) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const newAudio = new Audio(url);
    setAudio(newAudio);
    newAudio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });

    return () => {
      newAudio.pause();
      newAudio.src = ""; // Release the audio object for garbage collection
    };
  }, [url]); // Reinitialize when `url` changes
  const playAudio = () => {
    if (audio) {
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };
  return <button onClick={playAudio}>Play Audio</button>; // Render something for visibility
}
