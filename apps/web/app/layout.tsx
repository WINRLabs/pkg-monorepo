import "./globals.css";
import "@winrlabs/games/dist/index.css";
import "@winrlabs/ui/dist/index.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { Providers } from "./providers";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-notoSans",
});

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        className={notoSans.className}
        style={{ background: "#000", color: "#fff" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
