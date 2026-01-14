"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
    const [text, setText] = useState("");
    const fullText = "Synesthesia AI... Security Hardened.";

    // Typewriter effect
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= fullText.length) {
                setText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Speed: 50ms per char ~1.5 seconds total

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
            <div className="z-10 w-full max-w-5xl items-center justify-center font-serif text-5xl lg:text-7xl flex text-foreground/90 tracking-tight">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {text}
                </motion.span>
                <span className="cursor-blink w-1 h-[0.8em] bg-foreground/50 ml-2 block" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="mt-12 text-sm text-foreground/50 font-sans"
            >
                <p>System Status: Secure</p>
                <p>Rate Limiting: Active</p>
                <p>Input Validation: Strict</p>
            </motion.div>
        </main>
    );
}
