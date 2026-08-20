import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProviders from '@/components/ClientProviders'
import { SITE_URL } from '@/lib/site'
import { inter, syne, jetbrainsMono } from './fonts'

export const metadata: Metadata = {
  title: {
    default: 'Shah Solutions — SEO, GEO, Web, App & AI Services',
    template: '%s | Shah Solutions',
  },
  description:
    'Shah Solutions delivers SEO, GEO, web & app development, AI agents, AI chatbots, and cloud solutions for businesses worldwide — based in Pakistan.',
  keywords: [
    'IT services Pakistan',
    'SEO services Pakistan',
    'GEO optimization',
    'web development Pakistan',
    'app development Pakistan',
    'digital marketing Pakistan',
    'custom website development',
    'React Next.js developer Pakistan',
    'Flutter app developer',
    'cloud solutions Pakistan',
    'Shah Solutions',
    'IT company Pakistan',
    'best IT company Pakistan',
    'website design Pakistan',
    'mobile app development Pakistan',
    'generative engine optimization',
    'AI SEO services',
    'e-commerce development Pakistan',
    'AI agent development',
    'AI chatbot development',
    'trading bot development',
  ],
  authors: [{ name: 'Shah Solutions', url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: 'Shah Solutions',
  publisher: 'Shah Solutions',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Shah Solutions',
    title: 'Shah Solutions — SEO, GEO, Web, App & AI Services',
    description:
      'Expert IT services: SEO, GEO, web & app development, AI agents, AI chatbots, and digital marketing. Transforming businesses worldwide.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Shah Solutions — SEO, GEO, Web, App & AI Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shah Solutions — SEO, GEO, Web, App & AI Services',
    description:
      'Expert IT services: SEO, GEO, web & app development, AI agents, AI chatbots & digital marketing.',
    images: ['/opengraph-image'],
    creator: '@shahsolutions',
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  category: 'technology',
  verification: {
    google: 'k88qfXOQrT6FoieJEIDxeKfkWOxrbUsfGIRsSBo9esY',
  },
}

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  colorScheme: 'dark',
}

const BASE = SITE_URL

const siteSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Shah Solutions',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        '@id': `${BASE}/#logo`,
        url: `${BASE}/favicon.svg`,
        contentUrl: `${BASE}/favicon.svg`,
        width: 512,
        height: 512,
        caption: 'Shah Solutions',
      },
      image: `${BASE}/opengraph-image`,
      description: 'Shah Solutions is a premium IT services company providing SEO optimization, GEO/AI search optimization, custom web development, mobile app development, digital marketing, cloud solutions, AI agents, AI chatbots, and trading bots to businesses worldwide.',
      telephone: '+92-303-2818320',
      email: 'amaherwani@gmail.com',
      foundingDate: '2019',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK',
        addressLocality: 'Pakistan',
      },
      areaServed: 'Worldwide',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+92-303-2818320',
          contactType: 'customer service',
          email: 'amaherwani@gmail.com',
          availableLanguage: ['English', 'Urdu'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '20:00',
          },
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'amaherwani@gmail.com',
          availableLanguage: ['English', 'Urdu'],
        },
      ],
      sameAs: ['https://www.google.com/search?q=Shah+Solutions&stick=H4sIAAAAAAAA_-NgU1I1qDCzSLK0MDNItkwyNTQwNE2zMqgwSjUxNEs1tDROTTZNMzBMXsTKF5yRmKEQnJ9TWpKZn1cMAOBPwDw6AAAA&hl=en-GB&mat=CduxyV9wG1FNElYBa0lj_32NIR2kUnSLFUI_X07PQWE9zLyVo20Wo-SpRgLSeUQGgHFZhmUTwjuKUwNqkSYvRcbgiJvcKYrxbEst6fMueiKNC-iWo8NAqrP7Yc0MmpUVVw&authuser=0'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'IT Services Catalog',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Optimization', description: 'Technical SEO, keyword research, link building, and on-page optimization to rank higher on Google and Bing.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GEO / AI Search Optimization', description: 'Generative Engine Optimization — get cited in ChatGPT, Google AI Overviews, Perplexity, and AI-powered search.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development', description: 'Custom websites and web applications using Next.js, React, and TypeScript.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'App Development', description: 'Native iOS and Android apps and cross-platform Flutter/React Native applications.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing', description: 'Full-funnel marketing: PPC ads, social media management, email campaigns, and conversion optimization.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud Solutions', description: 'Cloud infrastructure setup and DevOps on AWS, Azure, and Google Cloud Platform.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Agents', description: 'Custom autonomous AI agents that plan and take action across your tools and data, with human-in-the-loop controls.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Chatbots', description: 'Custom AI chatbots trained on your business content, deployable on web, WhatsApp, or Slack.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trading Bots', description: 'Custom algorithmic trading bots built to your own strategy, with backtesting and exchange API integration. Software development only, not financial advice.' } },
        ],
      },
      knowsAbout: [
        'Search Engine Optimization', 'Generative Engine Optimization', 'AI Search Optimization',
        'Answer Engine Optimization', 'Google AI Overviews', 'Core Web Vitals', 'Technical SEO',
        'Semantic Search', 'Entity Optimization', 'Structured Data', 'Schema.org',
        'Web Development', 'Next.js', 'React', 'TypeScript',
        'Mobile App Development', 'Flutter', 'React Native',
        'Digital Marketing', 'PPC Advertising', 'Social Media Marketing',
        'Cloud Computing', 'AWS', 'Azure', 'Google Cloud Platform',
        'Zero-click Optimization', 'Multimodal Search',
        'AI Agent Development', 'AI Chatbot Development', 'Conversational AI',
        'Algorithmic Trading', 'Trading Bot Development', 'Large Language Models',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      name: 'Shah Solutions',
      url: BASE,
      description: 'Premium IT services: SEO, GEO/AI Search Optimization, Web Development, App Development, Digital Marketing, and Cloud Solutions.',
      publisher: { '@id': `${BASE}/#organization` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/services#{search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': `${BASE}/#business`,
      name: 'Shah Solutions',
      description: 'Shah Solutions provides premium IT services including SEO optimization, GEO/AI search optimization, custom web development, mobile app development, digital marketing, cloud solutions, AI agents, AI chatbots, and trading bots.',
      url: BASE,
      telephone: '+92-303-2818320',
      email: 'amaherwani@gmail.com',
      priceRange: '$$-$$$',
      currenciesAccepted: 'USD, PKR',
      paymentAccepted: 'Bank Transfer, PayPal, Wise',
      address: { '@type': 'PostalAddress', addressCountry: 'PK', addressLocality: 'Pakistan' },
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'AdministrativeArea', name: 'Worldwide' },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      serviceType: [
        'SEO Optimization', 'Generative Engine Optimization', 'AI Search Optimization',
        'Web Development', 'Mobile App Development', 'Digital Marketing', 'Cloud Solutions', 'IT Consulting',
        'AI Agent Development', 'AI Chatbot Development', 'Algorithmic Trading Software Development',
      ],
      parentOrganization: { '@id': `${BASE}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-58F9JKWW');` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchemas) }}
        />
      </head>
      <body className="bg-dark text-white antialiased noise-overlay">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-58F9JKWW" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-8EQ10MNNGP" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8EQ10MNNGP');
        `}</Script>
        <ClientProviders />
        <Navbar />
        <main className="relative z-10 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
