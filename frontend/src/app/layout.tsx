import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { ToastProvider } from "@/components/feedback/Toast";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Hybrid Image Steganography System | Research Architecture",
  description: "Enterprise multi-layer steganography platform integrating Morse Code, AES-256 GCM, LSB, DCT, and DWT algorithms.",
  keywords: [
    "Steganography",
    "Morse Code",
    "AES-256",
    "LSB",
    "DCT",
    "DWT",
    "Cybersecurity",
    "Image Security",
    "Digital Image Processing",
  ],
  authors: [{ name: "Devanshu Bachhav", url: "https://github.com/DevanshuBachhav00200" }],
  creator: "Devanshu Bachhav",
  publisher: "StegoCyber Architecture",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hybrid-steganography.org",
    title: "Hybrid Image Steganography System",
    description: "Multi-domain data embedding with Morse pre-modulation & authenticated AES-256 GCM encryption.",
    siteName: "StegoCyber System",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hybrid Image Steganography System",
    description: "Enterprise multi-layer steganography platform integrating Morse Code, AES-256, LSB, DCT, and DWT algorithms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="flex flex-col min-h-screen bg-background text-text-primary antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <AppLayout>{children}</AppLayout>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
