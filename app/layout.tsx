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

export const metadata: Metadata = {
  title: "Happy Women's Day 8/3",
  description: "Chúc mừng ngày quốc tế phụ nữ 8/3! Một món quà nhỏ dành tặng em.",
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
