import type { ReactNode } from "react";
import { motion } from "framer-motion";
import SpinnerCircle from "../Spinner/Circle";

interface LoadingLine {
    text: string;
    delay?: number;
    className?: string;
}

interface LoadingSequenceProps {
    lines: LoadingLine[];
    spinner?: ReactNode;
}

export default function LoadingSequence({
    lines,
    spinner = <SpinnerCircle />,
}: LoadingSequenceProps) {
    return (
        <div className="h-screen flex flex-col justify-center items-center space-y-4">
            {spinner}

            {lines.map((line, index) => (
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: line.delay ?? index * 2.5,
                        duration: 0.5,
                        ease: "easeOut",
                    }}
                    className={line.className ?? "text-sm text-kidemia-gray-400 text-center"}
                >
                    {line.text}
                </motion.p>
            ))}
        </div>
    );
}
