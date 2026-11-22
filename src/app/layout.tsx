import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sahaay (सहाय) – Accessible Community & Emergency Communication',
  description:
    'Inclusive emergency response and mutual-aid communication network powered by Nexconn Chat SDK & Chat UI.',
  keywords: [
    'Sahaay',
    'Nexconn',
    'Nexconn Chat SDK',
    'Emergency Communication',
    'Accessible Chat',
    'Community Aid',
    'Hackathon',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
