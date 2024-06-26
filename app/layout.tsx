import "@radix-ui/themes/styles.css";
import { Container, Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assignment 2",
  description: "Cloud Computing Assignment 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <Theme accentColor="indigo" className="h-full">
          <NavBar />
          <main className="p-5 h-full">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
