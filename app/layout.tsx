import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assignment 1",
  description: "Cloud Computing Assignment 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <Theme accentColor="indigo" className="h-full">
          <NavBar />
          <main className="p-5 h-full">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
