"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PARAGRAPHS = [
  "Gửi em!",
  "Nhân ngày 8/3, chúc em có một ngày thật trọn vẹn theo cách riêng của mình. Mong rằng hôm nay em sẽ được bao quanh bởi những điều tích cực, những lời chúc chân thành và những khoảnh khắc khiến em mỉm cười một cách tự nhiên nhất.",
  "Hy vọng em luôn giữ được sự tự tin và bản lĩnh vốn có. Dù phía trước là những kế hoạch, thử thách hay mục tiêu mới, chúc em đủ kiên nhẫn để theo đuổi đến cùng và đủ mạnh mẽ để vượt qua những điều không như ý. Mỗi bước em đi, dù nhanh hay chậm, đều là sự tiến bộ đáng trân trọng.",
  "Chúc em luôn khỏe mạnh, tinh thần vững vàng và ngày càng hoàn thiện phiên bản tốt nhất của chính mình. Mong rằng không chỉ riêng hôm nay, mà thật nhiều ngày sau nữa, em vẫn sẽ cảm thấy tự hào về những gì mình đang làm và những gì mình đang trở thành.",
  "Chúc em một 8/3 thật vui và ý nghĩa.",
];

// ms per character — slower for first line, faster for long paragraphs
const CHAR_SPEEDS = [60, 22, 20, 20, 38];
// Pause (ms) before starting next paragraph
const PARA_GAP = 400;
const SIGNATURE_GAP = 600;

interface Props {
  onClose: () => void;
}

export default function LetterModal({ onClose }: Props) {
  // typed[i] = number of chars revealed for paragraph i
  const [typed, setTyped] = useState<number[]>(PARAGRAPHS.map(() => 0));
  const [showSignature, setShowSignature] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function typeAll() {
      for (let i = 0; i < PARAGRAPHS.length; i++) {
        // Wait gap before paragraph (except first)
        if (i > 0) await wait(PARA_GAP);
        const para = PARAGRAPHS[i];
        const speed = CHAR_SPEEDS[i];

        for (let c = 1; c <= para.length; c++) {
          if (cancelled) return;
          await wait(speed);
          setTyped((prev) => {
            const next = [...prev];
            next[i] = c;
            return next;
          });
          // Auto-scroll
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }
      }
      await wait(SIGNATURE_GAP);
      if (!cancelled) setShowSignature(true);
    }

    typeAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-enter bg-[#fffaf9] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-pink-100">
          <h2
            className="text-lg font-semibold text-pink-600 tracking-wide"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Thư gửi em
          </h2>
          <button onClick={onClose} className="text-pink-400 hover:text-pink-600 text-xl leading-none">✕</button>
        </div>

        {/* Letter body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 pb-20">
          {PARAGRAPHS.map((para, i) => {
            const chars = typed[i];
            if (chars === 0) return null;
            const isTyping = chars < para.length;
            return (
              <p
                key={i}
                className={`text-pink-900 leading-8 mb-4 ${
                  i === 0 ? "text-lg font-semibold" : "text-[15px]"
                }`}
                style={{
                  fontFamily: "var(--font-lora), serif",
                  fontStyle: i === 0 ? "normal" : "italic",
                }}
              >
                {para.slice(0, chars)}
                {isTyping && (
                  <span className="inline-block w-[2px] h-[1em] bg-pink-400 ml-[1px] align-middle animate-pulse" />
                )}
              </p>
            );
          })}

          {/* Signature */}
          {showSignature && (
            <div
              className="para-reveal flex items-center justify-end gap-2 mt-6 pr-1"
              style={{ animationFillMode: "forwards" }}
            >
              <span
                className="text-pink-500 text-xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-lora), serif", fontStyle: "italic" }}
              >
                Norikachi
              </span>
              <svg width="22" height="20" viewBox="0 0 24 22" fill="#f472b6" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}
        </div>

        {/* Mewmew GIF – bottom right */}
        <div className="absolute bottom-3 right-4 pointer-events-none">
          <Image
            src="/images/mewmew.gif"
            alt="mewmew"
            width={72}
            height={72}
            unoptimized
            className="opacity-90 drop-shadow"
          />
        </div>
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
