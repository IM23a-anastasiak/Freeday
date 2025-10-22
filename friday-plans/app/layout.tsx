import type { Metadata } from "next";
import ClientClerkProvider from "@/components/ClientClerkProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freeday plans",
  description:
    "Collect Friday ideas, vote as a team and spin a wheel to pick the next hangout.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-slate-900 antialiased">
        <ClientClerkProvider>{children}</ClientClerkProvider>
      </body>
    </html>
  );
}
