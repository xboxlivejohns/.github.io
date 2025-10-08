import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DefaultSeo } from "next-seo";
import "../styles/globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Detailing Site",
  description: "A baseline Next.js project configured with Tailwind CSS."
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink">
        <DefaultSeo
          titleTemplate="%s | Detailing Site"
          defaultTitle="Detailing Site"
          description="A baseline Next.js project configured with Tailwind CSS."
          openGraph={{
            type: "website",
            locale: "en_GB",
            url: "https://example.com",
            siteName: "Detailing Site"
          }}
        />
        {children}
      </body>
    </html>
  );
}
