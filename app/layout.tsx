import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { MotionProvider } from "@/components/layout/motion-provider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Okike Studio",
  description: "Structure before scale",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')",
          }}
        />
      </head>
      <body id="top" className="flex min-h-screen flex-col">
        <MotionProvider>
          <SiteChrome><Navbar /></SiteChrome>
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteChrome><Footer /></SiteChrome>
        </MotionProvider>
      </body>
    </html>
  );
}
