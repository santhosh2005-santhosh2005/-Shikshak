import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({ text, className, showAsterisk }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <motion.div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="relative inline-block overflow-hidden mr-[0.2em] pb-[0.1em]">
          <motion.span
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
            {showAsterisk && i === words.length - 1 && (
              <span className="absolute top-[-0.1em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({ segments, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Flatten segments into words while keeping styles
  const allWords: { text: string; style: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((word) => {
      if (word) allWords.push({ text: word, style: seg.className || "" });
    });
  });

  return (
    <motion.div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {allWords.map((word, i) => (
        <span key={i} className={`relative inline-block overflow-hidden mr-[0.3em] pb-[0.1em] ${word.style}`}>
          <motion.span
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word.text}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export const AnimatedLetter: React.FC<{ char: string; index: number; total: number; progress: any }> = ({ 
  char, 
  index, 
  total, 
  progress 
}) => {
  const start = index / total;
  const end = start + (1 / total) * 10; // Wider window for smoother reveal
  const opacity = useTransform(progress, [start - 0.1, start + 0.05], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export const ScrollRevealText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  return (
    <div ref={containerRef} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
      ))}
    </div>
  );
};
