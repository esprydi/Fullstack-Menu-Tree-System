import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { MenuProvider } from "@/context/MenuContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fullstack Menu Tree System",
  description: "Fullstack Menu Tree System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-white text-slate-900 font-sans">
        <MenuProvider>
          <Toaster position="top-right" />
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-6 pt-24 lg:px-8 lg:pb-8 lg:pt-24">
            {children}
          </main>
        </MenuProvider>
      </body>
    </html>
  );
}
