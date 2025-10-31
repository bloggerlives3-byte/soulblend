import type { Metadata } from "next";
import "./globals.css";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "SoulBlend",
  description: "Layer your vocals with soulful loops and export a custom blend."
};

const fontClass = "font-sans";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx("bg-vinyl-900 text-white", fontClass)}>
        <div className="min-h-screen bg-gradient-to-b from-plum-900 via-vinyl-900 to-black">
          {children}
        </div>
      </body>
    </html>
  );
}
