import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Create Verus Crypto Invoices | Easy Payment Sharing",
  description: "Generate and share cryptocurrency payment invoices easily. Support for multiple currencies, QR codes, and direct Verus Mobile integration. Fast, secure, and user-friendly.",
  keywords: "crypto invoice, verus, cryptocurrency payment, payment sharing, crypto QR code, verus mobile, digital currency",
  icons: {
    icon: [
      { url: './favicon.ico' },
      { url: './icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: './icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: './apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Create Verus Crypto Invoices | Easy Payment Sharing",
    description: "Generate and share cryptocurrency payment invoices easily. Support for multiple currencies, QR codes, and direct Verus Mobile integration.",
    type: "website",
    url: "https://verusinvoices.com",
    images: [
      {
        url: "https://www.imgdumper.nl/uploads9/67b1f59314a4e/67b1f5926aa59-og-image.png",
        width: 1200,
        height: 630,
        alt: "Verus Invoice Generator Preview"
      }
    ],
    siteName: "Verus Invoice Generator"
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Verus Crypto Invoices | Easy Payment Sharing",
    description: "Generate and share cryptocurrency payment invoices easily. Support for multiple currencies, QR codes, and direct Verus Mobile integration.",
    images: ["https://www.imgdumper.nl/uploads9/67b1f59314a4e/67b1f5926aa59-og-image.png"],
    creator: "@M_eyse",
    site: "@VerusCoin"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://verusinvoices.com",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
