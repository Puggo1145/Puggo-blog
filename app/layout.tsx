import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// providers
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProvider from "@/components/providers/session-provider";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
import ModalProvider from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Puggo Blog",
  description: "Make Development Awesome, Elegant, and Fun",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg"
      }
    ]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session!}>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="notion-theme-2"
            >
              <Toaster position="bottom-right" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
