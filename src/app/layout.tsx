import type { Metadata } from "next";
import { Reddit_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Chatbot } from "@/components/Chatbot";

import { LanguageProvider } from "@/hooks/useLanguage";

const mainFont = Reddit_Sans({
  variable: "--font-main",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const monoFont = Reddit_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FIVE + ONE | Architecture Studio",
  description: "Boutique architecture studio by Mr. Kosuke Osawa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body
          className={`${mainFont.variable} ${monoFont.variable} antialiased font-sans`}
        >
          <LanguageProvider>
            {children}
            <Chatbot />
            <VisualEditsMessenger />
          </LanguageProvider>
        </body>

    </html>
  );
}
