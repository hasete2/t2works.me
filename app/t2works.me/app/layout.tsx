import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "t2works.me",
  description: "Python, Go, Elasticsearch, Solr, Trekking, Cycling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="ja">
      <body>
        <header>
          <strong className="logo"><a href="/">t2works.me</a></strong>
        </header>
        {children}
        <footer>
          <p>&copy; 2024 t2works.me</p>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-1GGY74XTSF" />
    </html>
  )
}