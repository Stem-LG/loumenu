import { GeistSans } from "geist/font/sans";
// import { ThemeProvider } from "next-themes";
import "./globals.css";
import QueryProvider from "./_providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Loumenu",
  description: "The fastest way to create a digital menu for your restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
