import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Scoop Company | Gelato Celebration Cakes",
  description: "Hand-crafted gelato cakes, built your way. Pick your flavours, buttercream and toppings. Made fresh by Gelato by Maria for birthdays and celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 16 Oct 2026: the Meta pixel is gone from this site. Every page here
            forwards to thescoopcompany.co.uk, which carries the same pixel id
            547108697873362. Two sites firing one pixel made the numbers on
            Andrew's side impossible to read. /api and /admin are all that still
            render from here, and they are not customer-facing. */}
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
