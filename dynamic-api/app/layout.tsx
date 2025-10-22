import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import '../styles/theme.css';
import '../styles/globals.css';
import { LocalBusinessSchema, ServiceSchema, FAQSchema, BreadcrumbSchema, WebSiteSchema } from './structured-data';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GoogleAnalytics from '../components/analytics/GoogleAnalytics';

// Font Optimization with next/font
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'Feest DJ Zuid Nederland | DJ Bruiloft Brabant | DJ Bedrijfsfeest',
    template: '%s | Mister DJ',
  },
  description: 'Zoek je een Feest DJ? Mister DJ, specialist DJ Bruiloft Brabant en bedrijfsfeesten. 15+ jaar ervaring, 2500+ events, 100% dansgarantie. Vraag offerte!',
  keywords: ['feest dj zuid nederland', 'dj bruiloft brabant', 'dj bedrijfsfeest', 'bruiloft dj eindhoven', 'feest dj tilburg', 'bruiloft entertainment', 'drive-in show', 'photobooth'],
  authors: [{ name: 'Mister DJ' }],
  creator: 'Mister DJ',
  publisher: 'Mister DJ',
  metadataBase: new URL('https://mr-dj.sevensa.nl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://mr-dj.sevensa.nl',
    siteName: 'Mister DJ',
    title: 'Feest DJ Zuid Nederland | DJ Bruiloft Brabant',
    description: 'Specialist voor DJ Bruiloft Brabant en Feesten. 15+ jaar ervaring, 2500+ events, 100% dansgarantie. Boek de beste Feest DJ in Zuid Nederland!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mister DJ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mister DJ - Bruiloft & Feest DJ',
    description: 'Professionele DJ service voor bruiloften en feesten.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E88F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0F56B1' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body bg-surface-bg text-text antialiased">
        {/* Structured Data - Schema.org JSON-LD */}
        <LocalBusinessSchema />
        <ServiceSchema />
        <FAQSchema />
        <BreadcrumbSchema />
        <WebSiteSchema />

        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        {/* Dynamic Content Script (A/B Testing) */}
        <script src="/assets/js/dynamic-content.js" defer />

        {/* Analytics & Tracking - Now client-side to prevent hydration issues */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
