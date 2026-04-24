import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A clean and simple todo application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
