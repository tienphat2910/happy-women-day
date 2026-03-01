"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const FLOWERS = [
  { src: "/images/flower1.png", x: "15%", y: "20%", size: 64, delay: 0 },
  { src: "/images/flower2.png", x: "75%", y: "15%", size: 56, delay: 0.15 },
  { src: "/images/flower3.png", x: "50%", y: "8%",  size: 72, delay: 0.05 },
  { src: "/images/flower4.png", x: "85%", y: "60%", size: 52, delay: 0.25 },
  { src: "/images/flower1.png", x: "10%", y: "65%", size: 48, delay: 0.3 },
  { src: "/images/flower2.png", x: "60%", y: "75%", size: 60, delay: 0.1 },
  { src: "/images/flower3.png", x: "30%", y: "80%", size: 44, delay: 0.2 },
  { src: "/images/flower4.png", x: "40%", y: "30%", size: 50, delay: 0.08 },
];

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // in → hold at 600ms, hold → out at 2200ms, done at 2800ms
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"),  2200);
    const t3 = setTimeout(() => onDone(),          2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fce4ec] overflow-hidden"
      style={{
        transition: "opacity 0.6s ease",
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      {/* Background scattered flowers */}
      {FLOWERS.map((f, i) => (
        <div
          key={i}
          className="absolute float"
          style={{
            left: f.x,
            top: f.y,
            animationDelay: `${f.delay + i * 0.1}s`,
            animationDuration: `${2.5 + (i % 3) * 0.5}s`,
            transform: "translate(-50%, -50%)",
            opacity: phase === "in" ? 0 : 0.85,
            transition: `opacity 0.5s ease ${f.delay}s`,
          }}
        >
          <Image src={f.src} alt="" width={f.size} height={f.size} className="drop-shadow" />
        </div>
      ))}

      {/* Center content */}
      <div
        className="flex flex-col items-center gap-4 z-10"
        style={{
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.85) translateY(12px)" : "scale(1) translateY(0)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        {/* Center flower cluster */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute bloom"
              style={{
                animationDelay: `${i * 0.15}s`,
                transform: `rotate(${i * 90}deg) translate(28px)`,
              }}
            >
              <Image
                src={`/images/flower${(i % 4) + 1}.png`}
                alt=""
                width={36}
                height={36}
              />
            </div>
          ))}
          {/* Mewmew center */}
          <Image
            src="/images/mewmew.gif"
            alt="mewmew"
            width={52}
            height={52}
            unoptimized
            className="relative z-10 drop-shadow bloom"
            style={{ animationDelay: "0.4s" } as React.CSSProperties}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <p
            className="text-3xl font-bold text-pink-700 tracking-widest"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Happy 8/3
          </p>
          <p className="text-pink-400 text-xs tracking-[0.35em] uppercase mt-1 font-medium">
            Dành tặng em
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-400"
              style={{
                animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
