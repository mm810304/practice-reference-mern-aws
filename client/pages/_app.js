import Router from 'next/router';
import Nprogress from 'nprogress';

import Layout from '../components/Layout';

import '../components/styles/nprogress.css';
import '../components/styles/index.css';

Router.events.on('routeChangeStart', () => Nprogress.start());
Router.events.on('routeChangeComplete', () => Nprogress.done());
Router.events.on('routeChangeError', () => Nprogress.done());

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};