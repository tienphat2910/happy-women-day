"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "../contexts/AudioContext";

interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

const TRACKS: Track[] = [
  { title: "Ai Ngoài Anh",   artist: "Sơn Tùng M-TP",  src: "/audio/Ai Ngoài Anh.mp3",   cover: "/images/1.jpg" },
  { title: "Có Đôi Điều",    artist: "Tăng Duy Tân",   src: "/audio/Có Đôi Điều.mp3",    cover: "/images/2.jpg" },
  { title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP",  src: "/audio/Nơi Này Có Anh.mp3", cover: "/images/3.jpg" },
];

function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  onClose: () => void;
}

export default function MusicModal({ onClose }: Props) {
  const audioCtx = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = TRACKS[trackIdx];

  // Keep ref in sync so onClose closure sees latest value
  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    if (playing) {
      audio.play().catch(() => {});
      audioCtx.onPlayerPlay(track.src);
    }
  }, [trackIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onDur  = () => setDuration(audio.duration);
    const onEnd  = () => {
      setTrackIdx((i) => (i + 1) % TRACKS.length);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const handleClose = () => {
    const audio = audioRef.current;
    const wasPl = playingRef.current;
    const src = TRACKS[trackIdx].src;
    if (audio) audio.pause();
    audioCtx.onPlayerClose(src, wasPl);
    onClose();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      audioCtx.onPlayerPause();
    } else {
      audioCtx.onPlayerPlay(track.src);
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (v: number) => {
    if (audioRef.current) audioRef.current.currentTime = v;
    setCurrent(v);
  };

  const prev = () => setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  const next = () => setTrackIdx((i) => (i + 1) % TRACKS.length);

  const percent = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-enter bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-lg font-semibold text-pink-700 tracking-wide">Music Player</h2>
          <button onClick={handleClose} className="text-pink-400 hover:text-pink-600 text-xl leading-none">✕</button>
        </div>

        {/* Album cover */}
        <div className="mx-auto mt-2 w-44 h-44 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-100">
          <Image
            src={track.cover}
            alt={track.title}
            width={176}
            height={176}
            className={`object-cover w-full h-full transition-all duration-500 ${playing ? "scale-105" : "scale-100"}`}
          />
        </div>

        {/* Song info */}
        <div className="text-center mt-4 px-5">
          <p className="text-base font-semibold text-pink-800 truncate">{track.title}</p>
          <p className="text-sm text-pink-400">{track.artist}</p>
        </div>

        {/* Progress */}
        <div className="px-6 mt-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #e91e8c ${percent}%, #f8bbd0 ${percent}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-pink-400 mt-1">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 my-4">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 active:scale-95 transition-all shadow-sm text-lg"
          >
            &#9664;&#9664;
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 active:scale-95 transition-all shadow-md text-xl"
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 active:scale-95 transition-all shadow-sm text-lg"
          >
            &#9654;&#9654;
          </button>
        </div>

        {/* Playlist */}
        <div className="border-t border-pink-100 px-4 pb-4">
          <p className="text-xs text-pink-400 font-medium mt-3 mb-2 uppercase tracking-wider">Danh sách</p>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {TRACKS.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setTrackIdx(i);
                  setPlaying(true);
                  audioCtx.onPlayerPlay(TRACKS[i].src);
                  setTimeout(() => audioRef.current?.play().catch(() => {}), 50);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                  i === trackIdx ? "bg-pink-100 text-pink-700" : "hover:bg-pink-50 text-pink-500"
                }`}
              >
                <span className={`w-5 h-5 text-xs flex items-center justify-center rounded-full ${i === trackIdx ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-400"}`}>
                  {i === trackIdx && playing ? "♪" : (i + 1)}
                </span>
                <span className="text-sm font-medium truncate">{t.title}</span>
                <span className="text-xs text-pink-300 ml-auto">{t.artist}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
