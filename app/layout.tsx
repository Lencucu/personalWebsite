import './global.css';
import localFont from 'next/font/local';
import { Suspense } from 'react';

// const smileySans = localFont({
//   src: './../public/fonts/SmileySans-Oblique.ttf.woff2',
//   variable: '--font-smileySans',
// })
const titleBlack = localFont({
  src: './../public/fonts/优设标题黑.ttf',
  variable: '--font-优设标题黑',
})
// const qiji = localFont({
//   src: './../public/fonts/qiji.woff2',
//   variable: '--font-qiji',
// })
// const qijiCombo = localFont({
//   src: './../public/fonts/qiji-combo.ttf',
//   variable: '--font-qiji_combo',
// })
// const qijiFallback = localFont({
//   src: './../public/fonts/qiji-fallback.ttf',
//   variable: '--font-qiji_fallback',
// })

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