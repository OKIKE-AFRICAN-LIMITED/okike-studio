import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { MotionProvider } from "@/components/layout/motion-provider";
import { StudioChatWidget } from "@/components/ai/studio-chat-widget";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OKIKE Studio | Independent Brand, Product & Software Studio",
  description: "Structure before scale. We turn ambitious ideas into distinct brands, useful digital products, and ventures built to grow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')",
          }}
        />
      </head>
      <body id="top" className="flex min-h-screen flex-col" suppressHydrationWarning>
        <MotionProvider>
          <SiteChrome><Navbar /></SiteChrome>
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteChrome>
            <Footer />
            <StudioChatWidget />
          </SiteChrome>
        </MotionProvider>
      </body>
    </html>
  );
}
