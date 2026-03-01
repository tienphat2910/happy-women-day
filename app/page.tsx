"use client";
import { useState } from "react";
import FallingFlowers from "./components/FallingFlowers";
import PinScreen from "./components/PinScreen";
import MusicModal from "./components/MusicModal";
import LetterModal from "./components/LetterModal";
import ImageModal from "./components/ImageModal";
import LoadingScreen from "./components/LoadingScreen";
import { AudioProvider } from "./contexts/AudioContext";
import { useRouter } from "next/navigation";

type Modal = "music" | "letter" | "image" | null;

const ITEMS = [
  {
    key: "music",
    label: "Music",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
    ),
    desc: "Nghe nhạc",
  },
  {
    key: "letter",
    label: "Letter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    desc: "Thư gửi em",
  },
  {
    key: "image",
    label: "Image",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
      </svg>
    ),
    desc: "Ảnh kỷ niệm",
  },
  {
    key: "gift",
    label: "Gift",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M20 6h-2.18A3 3 0 0 0 12 3.82 3 3 0 0 0 6.18 6H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2zm-8-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-4 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 14H7v-7h4v7zm6 0h-4v-7h4v7zm1-9H4V8h16v3z" />
      </svg>
    ),
    desc: "Quà tặng",
  },
] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const router = useRouter();

  const handleUnlock = () => {
    setTransitioning(true);
    setTimeout(() => {
      setUnlocked(true);
      setTransitioning(false);
    }, 400);
  };

  const handleItem = (key: string) => {
    if (key === "gift") {
      router.push("/gift");
      return;
    }
    setModal(key as Modal);
  };

  return (
    <AudioProvider>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div className="relative min-h-screen overflow-hidden bg-[#fce4ec]">
        <FallingFlowers />

      {/* PIN screen */}
      {!unlocked && (
        <div
          className={`relative z-10 min-h-screen ${transitioning ? "slide-out" : ""}`}
        >
          <PinScreen onUnlock={handleUnlock} />
        </div>
      )}

      {/* Hub */}
      {unlocked && (
        <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 ${transitioning ? "" : "slide-in"}`}>
          {/* Title */}
          <div className="text-center mb-10">
            <p className="text-pink-400 tracking-[0.4em] text-xs font-semibold uppercase mb-2">
              Dành cho em
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-pink-700 mb-1"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Happy 8/3
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-px w-16 bg-pink-300" />
              <svg width="16" height="14" viewBox="0 0 24 22" fill="#f472b6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="h-px w-16 bg-pink-300" />
            </div>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm sm:max-w-md">
            {ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => handleItem(item.key)}
                className="group flex flex-col items-center justify-center gap-2 p-6 bg-white/90 rounded-3xl shadow-md border border-pink-100 hover:shadow-lg hover:border-pink-300 hover:-translate-y-1 active:scale-95 transition-all duration-200"
              >
                <span className="text-pink-400 group-hover:text-pink-600 transition-colors duration-200">
                  {item.icon}
                </span>
                <span className="text-base font-semibold text-pink-700">{item.label}</span>
                <span className="text-xs text-pink-400">{item.desc}</span>
              </button>
            ))}
          </div>

          <p className="text-pink-300 text-xs mt-10 tracking-widest uppercase">
            Norikachi
          </p>
        </div>
      )}

      {/* Modals */}
      {modal === "music" && <MusicModal onClose={() => setModal(null)} />}
      {modal === "letter" && <LetterModal onClose={() => setModal(null)} />}
      {modal === "image" && <ImageModal onClose={() => setModal(null)} />}
    </div>
    </AudioProvider>
  );
}

