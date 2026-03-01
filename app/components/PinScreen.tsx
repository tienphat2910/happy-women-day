"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const CORRECT_PIN = "0803";
const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

interface Props {
  onUnlock: () => void;
}

export default function PinScreen({ onUnlock }: Props) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const handleKey = (k: string) => {
    if (k === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (k === "") return;
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setTimeout(() => onUnlock(), 300);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin("");
        }, 600);
      }
    }
  }, [pin, onUnlock]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left – photo */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <Image
          src="/images/1.jpg"
          alt="Her photo"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-pink-200/20" />
        <div className="absolute bottom-8 left-8 right-8 text-white drop-shadow-lg">
          <p className="text-2xl font-light tracking-widest">HAPPY</p>
          <p className="text-4xl font-bold tracking-widest">8/3</p>
        </div>
      </div>

      {/* Right – PIN pad */}
      <div className="flex flex-1 flex-col items-center justify-center bg-pink-50 px-8 py-12 gap-8">
        {/* Mobile image */}
        <div className="md:hidden w-28 h-28 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
          <Image
            src="/images/1.jpg"
            alt="Her photo"
            width={112}
            height={112}
            className="object-cover object-top w-full h-full"
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-pink-400 tracking-[0.3em] uppercase font-medium">
            Nhập mã PIN
          </p>
          <p className="text-xs text-pink-300 mt-1">để mở quà tặng</p>
        </div>

        {/* Dots */}
            <div className={`flex gap-4 ${shake ? "shake" : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length
                  ? "bg-pink-500 border-pink-500 scale-105 dot-filled"
                  : "bg-transparent border-pink-400"
              }`}
            />
          ))}
        </div>

        {/* Error hint */}
        {shake && (
          <p className="text-xs text-red-400 -mt-4 animate-pulse">
            Mã PIN không đúng, thử lại
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {PAD_KEYS.map((k, idx) => {
            if (k === "") return <div key={idx} />;
            if (k === "del") {
              return (
                <button
                  key={idx}
                  onClick={() => handleKey("del")}
                  className="flex items-center justify-center h-14 rounded-2xl bg-pink-100 text-pink-500 hover:bg-pink-200 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  ⌫
                </button>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handleKey(k)}
                className="flex items-center justify-center h-14 rounded-2xl bg-white text-pink-700 text-xl font-medium hover:bg-pink-100 active:scale-95 active:bg-pink-200 transition-all duration-150 shadow-sm border border-pink-100"
              >
                {k}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-pink-300 text-center mt-2">
          Hint: Ngày đặc biệt hôm nay
        </p>
      </div>
    </div>
  );
}
