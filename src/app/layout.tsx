import type { Metadata } from 'next';
import './globals.css';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { DataProvider } from '@/contexts/DataContext';

export const metadata: Metadata = {
  title: 'STM Farm',
  description: 'Sistem administrasi dan informasi bisnis supplier ubi terpercaya.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SettingsProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
