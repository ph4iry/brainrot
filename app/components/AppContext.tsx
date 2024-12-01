"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";

type TranscriptionContextType = {
  transcript: string | undefined;
  aiResponse: string | undefined;
  isResponding: boolean;
};

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export const TranscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transcript, setTranscript] = useState<string | undefined>();
  const [aiResponse, setAIResponse] = useState<string | undefined>();
  const [isResponding, setIsResponding] = useState(false);

  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    setupMicrophone();
  }, [setupMicrophone]);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        paragraphs: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState, connectToDeepgram]);

  useEffect(() => {
    if (!microphone || !connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection.send(e.data);
      }
    };

    const onTranscript = async (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const currentTranscript = data.channel.alternatives[0].transcript;

      if (currentTranscript) {
        setTranscript(currentTranscript);
      }

      if (isFinal && speechFinal && currentTranscript) {
        setIsResponding(true);

        try {
          const response = await fetch("/api/brainrot-ai", {
            method: "POST",
            body: JSON.stringify({ sentence: currentTranscript }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          setAIResponse(result.response);
        } catch (error) {
          console.error("Error fetching AI response:", error);
        } finally {
          setIsResponding(false);
        }

        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setTranscript(undefined);
          setAIResponse(undefined);
        }, 5000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
  }, [connectionState, connection, microphone, startMicrophone]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [connection, microphoneState, connectionState]);

  return (
    <TranscriptionContext.Provider
      value={{
        transcript,
        aiResponse,
        isResponding,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error("useTranscription must be used within a TranscriptionProvider");
  }
  return context;
};
