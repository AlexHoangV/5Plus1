import type { Metadata } from "next";
import "./globals.css";
import { Chatbot } from "@/components/Chatbot";

import { Toaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://fiveplusone.com"),
  title: "FIVE + ONE | Architecture Studio",
  description: "Boutique architecture studio by Mr. Kosuke Osawa - Traditional Japanese Minimalism & Modern Brutalist Aesthetics",
  openGraph: {
    title: "FIVE + ONE | Architecture Studio",
    description: "Boutique architecture studio by Mr. Kosuke Osawa",
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
  return (
    <html lang="en" suppressHydrationWarning>
        <body
          className="antialiased font-sans"
        >
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="fd5536bb-3b33-40d9-82fe-c9eb5e249067"
        />
              <LanguageProvider>
                {children}
                <Chatbot />
                <Toaster position="top-right" richColors />
              </LanguageProvider>
        </body>

    </html>
  );
}
