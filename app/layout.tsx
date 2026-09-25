import React from 'react';
import './globals.css';

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export const metadata: SiteMetadata = {
  title: 'BinaUsaha - Platform Digital UMKM Indonesia',
  description:
    'BinaUsaha membantu UMKM mengurus legalitas PT/CV, website toko online, sistem kasir digital RajaKas, dan asisten konsultasi bisnis berbasis AI.',
  keywords: [
    'BinaUsaha',
    'Legalitas UMKM',
    'Pendirian PT',
    'Pembuatan Website UMKM',
    'Aplikasi Kasir POS',
    'NIB OSS RBA',
    'Sertifikasi Halal',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth scroll-pt-24">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
