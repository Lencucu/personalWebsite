'use client'

import './global.css';
import localFont from 'next/font/local'

const smileySans = localFont({
  src: './../public/fonts/SmileySans-Oblique.ttf.woff2',
  variable: '--font-smileySans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}