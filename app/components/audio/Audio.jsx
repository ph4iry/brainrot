"use client";
import React, { useState, useEffect } from "react";
import TTS from "./tts";

export default function AudioPlayer({ sentence }) {
  console.log(`we are saying: ${sentence}`)
  useEffect(() => {
    let currentAudio = null; // Declare an audio instance variable

    const getAudioURL = async () => {
      try {
        const url = await TTS(sentence);
        currentAudio = new Audio(url);
        await currentAudio.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    };

    getAudioURL();

    // Cleanup function
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = ""; // Release resources
      }
    };
  }, [sentence]);

  return null; // If no UI is needed
}
