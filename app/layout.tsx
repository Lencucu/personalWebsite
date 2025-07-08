import './global.css';
import localFont from 'next/font/local';
import { Suspense } from 'react';

const titleBlack = localFont({
  src: './../public/fonts/优设标题黑.ttf',
  variable: '--font-优设标题黑',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main className={titleBlack.className}>
          {children}
        </main>
      </body>
    </html>
  );
}