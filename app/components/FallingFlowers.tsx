"use client";
import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
  shape: "heart" | "circle" | "petal";
}

const COLORS = ["#f48fb1", "#f8bbd0", "#e91e8c", "#fce4ec", "#ef9a9a", "#f06292"];

const HeartSVG = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PetalSVG = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 20 28" fill={color} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="14" rx="8" ry="12" />
  </svg>
);

export default function FallingFlowers() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const shapes: ("heart" | "circle" | "petal")[] = ["heart", "petal", "circle", "heart", "petal"];
    const generated: Petal[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 12) + 10,
      delay: `${(Math.random() * 12).toFixed(1)}s`,
      duration: `${(Math.random() * 8 + 8).toFixed(1)}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal absolute top-0"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0,
          }}
        >
          {p.shape === "heart" && <HeartSVG color={p.color} size={p.size} />}
          {p.shape === "petal" && <PetalSVG color={p.color} size={p.size} />}
          {p.shape === "circle" && (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: 0.6,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
