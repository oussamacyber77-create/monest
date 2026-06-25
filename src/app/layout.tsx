import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { Providers } from "@/components/layout/providers"
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

export const metadata: Metadata = {
  title: "Monest — مجتمع رواد الأعمال",
  description:
    "Monest هو مجتمع رواد أعمال مع متابعة منظّمة — اجتماعات أسبوعية وفردية، تدريب شخصي، ومتابعة متجرك بالذكاء الاصطناعي.",
  icons: { icon: "/fav.svg" },
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
    >
      <body className="h-full flex flex-col">
        <Providers />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  )
}
