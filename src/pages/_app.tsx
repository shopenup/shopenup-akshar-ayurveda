import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { AppProvider, useAppContext } from '../context/AppContext';
import '../styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { cartItemCount, favouriteCount, isLoggedIn } = useAppContext();

  return (
    <Layout 
      cartItemCount={cartItemCount}
      favouriteCount={favouriteCount}
      isLoggedIn={isLoggedIn}
    >
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (
    <AppProvider>
      <AppContent {...props} />
    </AppProvider>
  );
}
