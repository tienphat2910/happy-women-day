"use client";
import Image from "next/image";
import { useState } from "react";

const ROW1_IMGS = [1, 2, 3, 4, 5, 6].map((n) => `/images/${n}.jpg`);
const ROW2_IMGS = [7, 8, 9, 10, 11, 12].map((n) => `/images/${n}.jpg`);
// Duplicate for seamless infinite loop
const ROW1 = [...ROW1_IMGS, ...ROW1_IMGS];
const ROW2 = [...ROW2_IMGS, ...ROW2_IMGS];

// item width(128) + gap(12) = 140px per item
const ITEM_W = 140;

const TICKER_TEXT = "HAPPY INTERNATIONAL WOMEN\u2019S DAY \u00a0\u00a0\u00a0\u00a0 HAPPY INTERNATIONAL WOMEN\u2019S DAY \u00a0\u00a0\u00a0\u00a0 ";

interface Props {
  onClose: () => void;
}

export default function ImageModal({ onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-enter bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 border-b border-pink-100 overflow-hidden">
          <Image src="/images/mewmew.gif" alt="mewmew" width={36} height={36} unoptimized className="flex-shrink-0 rounded-full" />
          <div className="overflow-hidden flex-1 min-w-0">
            {/* duplicate-track: two copies side-by-side, translate left by 50% */}
            <div className="ticker-left flex whitespace-nowrap">
              <span className="text-pink-600 text-sm font-semibold tracking-widest pr-8">{TICKER_TEXT}</span>
              <span className="text-pink-600 text-sm font-semibold tracking-widest pr-8">{TICKER_TEXT}</span>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 text-pink-400 hover:text-pink-600 text-xl leading-none ml-2">✕</button>
        </div>

        {/* ── Row 1 – scroll left (1–6) ── */}
        <div className="overflow-hidden py-3 bg-white">
          <div
            className="scroll-left flex gap-3"
            style={{ width: `${ROW1.length * ITEM_W}px`, animationDuration: "22s" }}
          >
            {ROW1.map((src, i) => (
              <button
                key={i}
                onClick={() => setPreview(src)}
                className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border-2 border-pink-100 hover:border-pink-400 transition-colors shadow-sm"
              >
                <Image src={src} alt={`Photo ${ROW1_IMGS[i % ROW1_IMGS.length].match(/\d+/)?.[0]}`} width={128} height={96} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Row 2 – scroll right (7–12) ── */}
        <div className="overflow-hidden py-3 bg-pink-50/50">
          <div
            className="scroll-right flex gap-3"
            style={{ width: `${ROW2.length * ITEM_W}px`, animationDuration: "22s" }}
          >
            {ROW2.map((src, i) => (
              <button
                key={i}
                onClick={() => setPreview(src)}
                className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border-2 border-pink-100 hover:border-pink-400 transition-colors shadow-sm"
              >
                <Image src={src} alt={`Photo ${ROW2_IMGS[i % ROW2_IMGS.length].match(/\d+/)?.[0]}`} width={128} height={96} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 border-t border-pink-100 overflow-hidden">
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="ticker-right flex whitespace-nowrap">
              <span className="text-pink-500 text-sm font-semibold tracking-widest pr-8">{TICKER_TEXT}</span>
              <span className="text-pink-500 text-sm font-semibold tracking-widest pr-8">{TICKER_TEXT}</span>
            </div>
          </div>
          <Image src="/images/mewmew.gif" alt="mewmew" width={36} height={36} unoptimized className="flex-shrink-0 rounded-full" />
        </div>
      </div>

      {/* ── Preview overlay ── */}
      {preview && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] w-[90vw]">
            <Image
              src={preview}
              alt="Preview"
              width={800}
              height={600}
              className="object-contain rounded-2xl shadow-2xl max-h-[85vh] w-auto mx-auto"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-pink-600 hover:bg-white text-sm shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
