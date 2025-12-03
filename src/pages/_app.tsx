import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
<<<<<<< HEAD
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
=======
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
>>>>>>> 443e39747ebd090858d894fe22cf777ed3e0b662
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontFamily: 'Cairo, system-ui, -apple-system, sans-serif',
            borderRadius: '1rem',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
<<<<<<< HEAD
    </ThemeProvider>
=======
    </ErrorBoundary>
>>>>>>> 443e39747ebd090858d894fe22cf777ed3e0b662
  );
}
