import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Word Cloud",
  description: "Word Cloud visualization using Next.js and Spring Boot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="light">
      <body className={`${inter.className} transition-colors duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
