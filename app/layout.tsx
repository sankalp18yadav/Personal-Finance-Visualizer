import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Personal Finance Visualizer",
  description: "Track and visualize your expenses easily",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white selection:bg-emerald-400/40">
        {children}
      </body>
    </html>
  );
}
