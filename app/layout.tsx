import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revamp — Costruiamo il futuro digitale delle imprese italiane",
  description:
    "Siti web custom-coded per PMI italiane. Design premium, prezzi accessibili.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
