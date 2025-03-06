import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { Navbar } from './components/nav'
import Footer from './components/footer'
import "./globals.css";

const main_font = Space_Mono({
  variable: "--font-main",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Adam's Blog",
  description: "A blog about software development and other things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/skull.svg" sizes="any" />
      <body className={`${main_font.variable} antialiased max-w-xl mx-4 mt-8 lg:mx-auto`}>
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 font-[family-name:var(--font-main)]">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
