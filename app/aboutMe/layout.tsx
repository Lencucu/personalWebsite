export const metadata = {
  title: 'aboutMe',
  description: 'Generated by Next.js',
}

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
  return <div className="h-[100dvh] flex justify-center items-center">{children}</div>;
}
