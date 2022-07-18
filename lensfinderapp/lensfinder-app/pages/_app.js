import '../styles/global.css'
import Head from 'next/head';

// This default export is required in a new `pages/_app.js` file.
export default function LensFinderApp({ Component, pageProps }) {
  return (
    <>
        <Head>
            <link rel="favicon" href="../public/favicon.ico" />
        </Head>
        <Component {...pageProps} />
    </>
  );
}