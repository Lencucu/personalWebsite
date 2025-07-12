import './global.css';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { smileySans } from './fonts';

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