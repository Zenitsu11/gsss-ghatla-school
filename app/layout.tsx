import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "GSSS Ghatla | Learn. Lead. Serve.", description: "Government Senior Secondary School, Ghatla" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
