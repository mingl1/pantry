import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
const displayFont = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-display",
});

const baseFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-default",
});
export const metadata: Metadata = {
  title: "CRUDsty Pantry",
  description: "A CRUD app, for your pantry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baseFont.variable} ${displayFont.variable} scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
