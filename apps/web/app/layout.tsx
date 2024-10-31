import '@winrlabs/ui/dist/index.css';
import '@winrlabs/games/dist/index.css';
import './globals.css';

import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { Providers } from './providers';
import { AppLayout } from './app-layout';
import { WinrWeb3Modals } from '@winrlabs/ui';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-notoSans',
});

export const metadata: Metadata = {
  title: 'Winr Labs Playground',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Providers>
      <html
        lang="en"
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <body
          className={`${notoSans.className} no-scrollbar`}
          style={{
            background: '#000',
            color: '#fff',
            overflowX: 'hidden',
            position: 'relative',
            height: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%',
            fontSize: '14px',
          }}
        >
          <AppLayout>{children}</AppLayout>
          <WinrWeb3Modals />
        </body>
      </html>
    </Providers>
  );
}
