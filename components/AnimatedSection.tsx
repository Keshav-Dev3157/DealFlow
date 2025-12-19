'use client'

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    duration?: number;
}

export default function AnimatedSection({
    children,
    delay = 0,
    y = 20,
    duration = 0.5
}: AnimatedSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
