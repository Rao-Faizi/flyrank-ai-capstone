import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Capstone Platform",
  description: "Next.js foundation deployed on Vercel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
          <Link href="/" className="font-bold text-lg text-emerald-400">
            Capstone App
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="hover:text-emerald-400 transition-colors">
              Analytics
            </Link>
            <Link href="/settings" className="hover:text-emerald-400 transition-colors">
              Settings
            </Link>
            <Link href="/health" className="hover:text-emerald-400 transition-colors">
              Health Check
            </Link>
          </nav>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
