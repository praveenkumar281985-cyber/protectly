import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProtectAI — Protect What You Buy",
  description:
    "Protect your purchases, warranties, refunds and consumer cases in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}