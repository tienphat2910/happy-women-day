"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface AudioCtx {
  /** Called when the music player starts playing a track */
  onPlayerPlay: (src: string) => void;
  /** Called when the music player pauses */
  onPlayerPause: () => void;
  /**
   * Called when the music player modal closes.
   * handoverSrc: the track that was last active in the player (empty = none)
   * wasPlaying: whether the player was actively playing when closed
   */
  onPlayerClose: (handoverSrc: string, wasPlaying: boolean) => void;
}

const Ctx = createContext<AudioCtx>({
  onPlayerPlay: () => {},
  onPlayerPause: () => {},
  onPlayerClose: () => {},
});

export function useAudio() {
  return useContext(Ctx);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<HTMLAudioElement | null>(null);
  // Track whether the bg is playing the original bgm or a handed-over track
  const [bgSrc, setBgSrc] = useState("/audio/music.mp3");
  const bgSrcRef = useRef("/audio/music.mp3");

  useEffect(() => {
    const audio = new Audio("/audio/music.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    bgRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {});
    };
    // Try immediately; browsers may block until interaction
    tryPlay();
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      audio.pause();
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
    };
  }, []);

  // When bgSrc changes (handover), swap the audio source
  useEffect(() => {
    const audio = bgRef.current;
    if (!audio) return;
    if (bgSrcRef.current === bgSrc) return;
    bgSrcRef.current = bgSrc;
    audio.src = bgSrc;
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => {});
  }, [bgSrc]);

  const onPlayerPlay = useCallback(() => {
    bgRef.current?.pause();
  }, []);

  const onPlayerPause = useCallback(() => {
    // Don't resume bg automatically on pause — let user control
  }, []);

  const onPlayerClose = useCallback((handoverSrc: string, wasPlaying: boolean) => {
    const audio = bgRef.current;
    if (!audio) return;
    if (wasPlaying && handoverSrc) {
      // Hand over: play the player's current track as background
      if (bgSrcRef.current !== handoverSrc) {
        setBgSrc(handoverSrc);
      } else {
        audio.play().catch(() => {});
      }
    } else {
      // Resume original bg from where it was (or restart)
      if (bgSrcRef.current !== "/audio/music.mp3") {
        setBgSrc("/audio/music.mp3");
      } else {
        audio.play().catch(() => {});
      }
    }
  }, []);

  return (
    <Ctx.Provider value={{ onPlayerPlay, onPlayerPause, onPlayerClose }}>
      {children}
    </Ctx.Provider>
  );
}
