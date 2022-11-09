import type { ReactElement } from "react";
import Head from "next/head";

export default function Header({ title }: { title: string }): ReactElement {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="256x256"
        href="/icon-256x256.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="384x384"
        href="/icon-384x384.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/icon-512x512.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
