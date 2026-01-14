import type { Metadata } from "next";
import { Inter, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata: Metadata = {
    title: "Synesthesia AI",
    description: "Sensory Translation Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${playfair.variable} ${quicksand.variable} font-sans antialiased min-h-screen bg-background`}>
                {children}
            </body>
        </html>
    );
}
