import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataHive: Efficient and Secure File Storage Solution",
  description: "Experience the power of DataHive, your central hub for efficient and secure file storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Toaster richColors />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
