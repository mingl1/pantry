import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModeToggle } from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/react";
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
  description: "A CRUD app, for your digital pantry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baseFont.variable} ${displayFont.variable} scroll-smooth bg-transparent`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-8 h-8 absolute right-4 top-4">
            <ModeToggle />
          </div>
          {children}
          <Toaster />;
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
