import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { getAuth } from "@/lib/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AutoInvest",
  description: "Plataforma de investimentos com robôs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = getAuth();

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b">
          <nav className="container mx-auto px-4 py-3 flex gap-4 items-center">
            <Link href="/" className="font-semibold">AutoInvest</Link>
            <div className="flex gap-3 text-sm">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/strategies">Estratégias</Link>
              <Link href="/portfolios">Portfólios</Link>
              <Link href="/backtests">Backtests</Link>
              {auth ? (
                <form action="/api/auth/logout" method="post" className="ml-auto">
                  <button type="submit">Sair</button>
                </form>
              ) : (
                <Link href="/login" className="ml-auto">Entrar</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
