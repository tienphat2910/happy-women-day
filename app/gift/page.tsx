"use client";
import Image from "next/image";
import FallingFlowers from "../components/FallingFlowers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FLOWER_IMGS = [
  "/images/flower1.png",
  "/images/flower2.png",
  "/images/flower3.png",
  "/images/flower4.png",
];

const FLOWERS = [
  { top: "4%",  left: "6%",  delay: 0,   size: 64,  img: 0 },
  { top: "3%",  left: "78%", delay: 0.3, size: 54,  img: 1 },
  { top: "16%", left: "48%", delay: 0.1, size: 76,  img: 2 },
  { top: "66%", left: "4%",  delay: 0.5, size: 58,  img: 3 },
  { top: "70%", left: "84%", delay: 0.4, size: 66,  img: 0 },
  { top: "80%", left: "46%", delay: 0.6, size: 50,  img: 1 },
  { top: "40%", left: "1%",  delay: 0.7, size: 46,  img: 2 },
  { top: "38%", left: "89%", delay: 0.2, size: 52,  img: 3 },
];

export default function GiftPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fce4ec] flex flex-col items-center justify-center py-10 px-4">
      <FallingFlowers />

      {/* Background flowers */}
      {FLOWERS.map((f, i) => (
        <div
          key={i}
          className="absolute pointer-events-none bloom float"
          style={{
            top: f.top,
            left: f.left,
            animationDelay: `${f.delay}s, ${i * 0.4}s`,
            animationDuration: "0.8s, 3s",
            width: f.size,
            height: f.size,
          }}
        >
          <Image
            src={FLOWER_IMGS[f.img]}
            alt=""
            width={f.size}
            height={f.size}
            className="w-full h-full object-contain drop-shadow"
          />
        </div>
      ))}

      {/* Card */}
      <div
        className={`relative z-10 flex flex-col items-center text-center bg-white/85 rounded-3xl shadow-2xl max-w-xs w-full border border-pink-100 overflow-hidden transition-all duration-700 ${
          show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        {/* Photo with bloom border */}
        <div className="relative w-full">
          {/* Decorative corner flowers */}
          <div className="absolute -top-5 -left-5 z-20 bloom" style={{ animationDelay: "0.5s" }}>
            <Image src="/images/flower2.png" alt="" width={52} height={52} className="drop-shadow" />
          </div>
          <div className="absolute -top-5 -right-5 z-20 bloom" style={{ animationDelay: "0.7s" }}>
            <Image src="/images/flower3.png" alt="" width={52} height={52} className="drop-shadow" />
          </div>

          <div
            className={`w-full aspect-[3/4] relative overflow-hidden transition-all duration-700 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="/images/1.jpg"
              alt="Her photo"
              fill
              className="object-cover object-top"
              priority
              onLoad={() => setImgLoaded(true)}
            />
            {/* Soft bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/60" style={{ maskImage: "linear-gradient(to bottom, transparent, white)" }} />
          </div>
        </div>

        {/* Text content */}
        <div className="px-6 pt-4 pb-7 flex flex-col items-center gap-3">
          {/* Main message */}
          <p
            className="para-reveal text-pink-700 text-2xl font-bold leading-9"
            style={{
              fontFamily: "var(--font-lora), serif",
              fontStyle: "italic",
              animationDelay: "300ms",
              animationFillMode: "forwards",
              opacity: 0,
            }}
          >
            Em là bông hoa xinh đẹp nhất!
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 w-full justify-center mt-1">
            <div className="h-px flex-1 bg-pink-200" />
            <Image src="/images/flower1.png" alt="" width={18} height={18} />
            <div className="h-px flex-1 bg-pink-200" />
          </div>

          {/* Wish lines */}
          {[
            "Chúc em một ngày 8/3 thật trọn vẹn",
            "Mãi rực rỡ và tỏa sáng theo cách riêng",
          ].map((w, i) => (
            <p
              key={i}
              className="para-reveal text-pink-500 text-sm leading-6"
              style={{
                fontFamily: "var(--font-lora), serif",
                fontStyle: "italic",
                animationDelay: `${700 + i * 450}ms`,
                animationFillMode: "forwards",
                opacity: 0,
              }}
            >
              {w}
            </p>
          ))}

          {/* Signature */}
          <p
            className="para-reveal text-pink-400 text-sm font-semibold mt-1"
            style={{
              fontFamily: "var(--font-lora), serif",
              fontStyle: "italic",
              animationDelay: "1700ms",
              animationFillMode: "forwards",
              opacity: 0,
            }}
          >
            — Norikachi
          </p>

          {/* Bottom flowers row */}
          <div className="flex items-center gap-3 mt-1">
            {[1, 2, 3, 4].map((n) => (
              <Image key={n} src={`/images/flower${n}.png`} alt="" width={28} height={28} className="float" style={{ animationDelay: `${n * 0.3}s` }} />
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="mt-2 px-6 py-2 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 active:scale-95 transition-all shadow-md"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
