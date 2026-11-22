import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sahaay – Community Support Network',
  description:
    'Community response and mutual-aid communication network powered by Nexconn Chat SDK & Chat UI.',
  keywords: [
    'Sahaay',
    'Nexconn',
    'Nexconn Chat SDK',
    'Emergency Communication',
    'Community Aid',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const origError = console.error;
                  console.error = function() {
                    // Suppress empty object or vendor SDK socket warnings in dev overlay
                    if (arguments.length === 1 && typeof arguments[0] === 'object' && arguments[0] !== null && Object.keys(arguments[0]).length === 0) {
                      console.warn('[SDK Notice]', arguments[0]);
                      return;
                    }
                    if (typeof arguments[0] === 'string' && (arguments[0].includes('IMLib') || arguments[0].includes('socket error') || arguments[0].includes('pb decode'))) {
                      console.warn(...arguments);
                      return;
                    }
                    origError.apply(console, arguments);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
