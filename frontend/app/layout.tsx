import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";

export const metadata: Metadata = {
  title: "SaaS Admin Dashboard",
  description: "Django, Next.js, and MySQL SaaS admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}