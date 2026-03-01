import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
});

const BASE_URL = "https://happy-women-day-eight.vercel.app";

export const metadata: Metadata = {
  title: "Happy Women's Day 8/3 🌸",
  description: "Chúc mừng ngày quốc tế phụ nữ 8/3! Một món quà nhỏ dành tặng em. 💕",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Happy Women's Day 8/3 🌸",
    description: "Chúc mừng ngày quốc tế phụ nữ 8/3! Một món quà nhỏ dành tặng em. 💕",
    url: BASE_URL,
    siteName: "Happy 8/3",
    images: [
      {
        url: "/images/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Women's Day 8/3 🌸",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Women's Day 8/3 🌸",
    description: "Chúc mừng ngày quốc tế phụ nữ 8/3! Một món quà nhỏ dành tặng em. 💕",
    images: [`${BASE_URL}/images/preview.jpg`],
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${lora.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
