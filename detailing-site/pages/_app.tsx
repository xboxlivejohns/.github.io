import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";

import Layout from "../components/Layout";
import "../styles/globals.css";

const defaultSeo = {
  titleTemplate: "%s | Detailing Site",
  defaultTitle: "Detailing Site",
  description: "A baseline Next.js project configured with Tailwind CSS.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://example.com",
    siteName: "Detailing Site"
  },
  twitter: {
    handle: "@detailingsite",
    site: "@detailingsite",
    cardType: "summary_large_image"
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSeo} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
