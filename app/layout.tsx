import "@/app/ui/global.css";
import {inter} from "@/app/ui/fonts";
import type {Metadata} from "next";

export const metadata:Metadata = {
  title: {
    template: "%s | NextJS Acme Dashboard",
    default: "Dashboard"
  },
  description: "The official dashboard for NextJS Acme",
  metadataBase: new URL("https://tutorial-nextjs-dashboard-kappa.vercel.app/"),
  openGraph: {
    images: "/og.png",
  },
  twitter: {
    images: "/og.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
