import './global.css';
import localFont from 'next/font/local'
const smileySans = localFont({
  src: './../public/fonts/SmileySans-Oblique.ttf.woff2',
})

export default function RootLayout({children}: {
  children: React.ReactNode;
}){
	return (
		<html>
			<body>{children}</body>
		</html>
	);
}