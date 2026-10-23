import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Instrument_Serif, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import "./globals.css";

// Inter's optical-size axis switches to its Display cut at headline sizes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["opsz"],
  display: "swap",
});

// The voice of printed order tickets.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Headlines: a serif with an optical-size axis and Cyrillic, since the site leads in Bulgarian.
const sourceSerif = Source_Serif_4({
  variable: "--font-display-serif",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  axes: ["opsz"],
  display: "swap",
});

// Only used by the sample client wordmarks, so it isn't preloaded.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Glovo, Wolt и Bolt Food на един екран`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name}: Glovo, Wolt и Bolt Food на един екран`,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Runs before first paint. Marks JS as available, and decides whether the homepage intro plays:
 * once per tab session, never with reduced motion. Add ?intro to the URL to replay it.
 */
const headScript = [
  "(function(){var d=document.documentElement;d.classList.add('js');",
  "try{if(location.pathname!=='/')return;",
  "if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;",
  "var force=location.search.indexOf('intro')>-1;",
  "if(!force&&sessionStorage.getItem('kov4-intro'))return;",
  "sessionStorage.setItem('kov4-intro','1');d.classList.add('intro')}catch(e){}})()",
].join("");

export const viewport: Viewport = {
  themeColor: "#0c0a09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bg"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable} ${plexMono.variable} ${instrument.variable} antialiased`}
    >
      <head>
        {/* Lets CSS hold scroll-triggered sequences until they're in view; without JS everything simply shows. */}
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Към съдържанието
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
