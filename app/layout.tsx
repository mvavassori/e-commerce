import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { ClientAuthProvider } from "@/utils/ClientAuthProvider";
import { CartContextProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "This is a standard e-commerce website built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientAuthProvider>
          <CartContextProvider>
            <Navbar />
            <main className="mt-16">{children}</main>
          </CartContextProvider>
        </ClientAuthProvider>
        <Footer />
      </body>
    </html>
  );
}
