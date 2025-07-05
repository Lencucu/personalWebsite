import './global.css';
import localFont from 'next/font/local';
import FetchWordMean from '@/app/ui/fetchWordMean';
import { Suspense } from 'react';

const smileySans = localFont({
  src: './../public/fonts/SmileySans-Oblique.ttf.woff2',
  variable: '--font-smileySans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main className={smileySans.className}>
          {children}
        </main>
      </body>
    </html>
  );
}