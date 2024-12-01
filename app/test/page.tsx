"use client";
import { useState, useEffect } from "react";
import AudioPlayer from "../components/audio/Audio";
import TTS from "../components/audio/tts";

export default function Page() {
  const [audioURL, setAudioURL] = useState(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      const url = await TTS("The king is back!");
      setAudioURL(url);
      console.log(url);
    };

    fetchAudioUrl(); // Trigger the async function only once
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      {audioURL && <AudioPlayer url={audioURL} />}
    </>
  );
}
