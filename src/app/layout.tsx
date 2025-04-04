import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import TanstackQueryProviders from "@/utils/providers/TanstackQueryProviders";
import Link from "next/link";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Zen Auth",
    description: "Next generation authentication system that is fast as fuck, safe as fuck, convenient as fuck.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TanstackQueryProviders>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <NextTopLoader
                        height={4}
                        showSpinner={false}
                        color="#dc8a78"
                    />
                    <div className="flex gap-4 p-2 text-lg">
                        <Link href={"/"}>
                            ← На главную
                        </Link>
                        <Link className="text-zinc-500" href={"/video"}>
                            → Посмотреть видеодемонстрацию
                        </Link>
                    </div>
                    {children}
                </body>
            </html>
        </TanstackQueryProviders>
    );
}
