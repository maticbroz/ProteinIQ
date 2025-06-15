import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
          />
        </noscript>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/lxv8dll.css"
        ></link>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />

        {/* Load analytics after interaction */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="XTC48q9JxfiK0VnMWftPSw"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  );
}
