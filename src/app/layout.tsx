import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { Providers } from "@/components/layout/providers"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2F2F2",
}

export const metadata: Metadata = {
  title: "Monest — AI Commerce Intelligence",
  description:
    "AI-powered commerce intelligence platform. Instant video meetings, CRM, and AI analytics for modern businesses.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Monest — AI Commerce Intelligence",
    description:
      "AI-powered commerce intelligence platform. Instant video meetings, CRM, and AI analytics for Salla stores.",
    type: "website",
    locale: "ar_SA",
    siteName: "Monest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monest — AI Commerce Intelligence",
    description:
      "AI-powered commerce intelligence platform. Instant video meetings, CRM, and AI analytics for Salla stores.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={[
        ibmPlexSansArabic.variable,
        jetbrainsMono.variable,
        "h-full antialiased",
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="h-full flex flex-col">
        <ToastProvider>
          <Providers />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
