import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { FontWrapper } from "@/components/FontWrapper";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains-mono",
});

const gtPressura = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Pressura-Mono-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Pressura-Mono-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gt-pressura",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fiveplusone.com"),
  title: "KOSUKE | FIVE + ONE – Brutalist & Zen Architecture Studio",
  description: "FIVE + ONE by architect Kosuke explores Brutalist, Zen and natural architecture through honest materials and contemporary context.",
  openGraph: {
    title: "KOSUKE | FIVE + ONE – Brutalist & Zen Architecture Studio",
    description: "FIVE + ONE by architect Kosuke explores Brutalist, Zen and natural architecture through honest materials and contemporary context.",
    url: "https://fiveplusone.com",
    siteName: "FIVE + ONE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Architect",
    "name": "KOSUKE – FIVE + ONE",
    "url": "https://fiveplusone.com",
    "logo": "https://fiveplusone.com/logo.png",
    "description": "Architectural studio exploring Brutalist, Zen and natural architecture through honest materials and contemporary context.",
    "sameAs": [
      "https://www.archdaily.com",
      "https://www.instagram.com/fiveplusone"
    ],
    "knowsAbout": [
      "Brutalist Architecture",
      "Zen Architecture",
      "Natural Architecture",
      "Contemporary Residential Design"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <LanguageProvider>
          <FontWrapper 
            jetbrainsMonoVar={jetbrainsMono.variable} 
            gtPressuraVar={gtPressura.variable}
          >
            <Script
              id="orchids-browser-logs"
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
              strategy="afterInteractive"
              data-orchids-project-id="fd5536bb-3b33-40d9-82fe-c9eb5e249067"
            />
            {children}
            <Chatbot />
            <Toaster position="top-right" richColors />
          </FontWrapper>
        </LanguageProvider>
    </html>
  );
}
