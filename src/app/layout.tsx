import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbDesk - Remote Desktop",
  description: "Secure and fast remote access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}