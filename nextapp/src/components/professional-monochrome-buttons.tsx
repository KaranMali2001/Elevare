"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ButtonProps {
  text: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
}

function ProfessionalMonochromeButton({
  text,
  primaryColor,
  secondaryColor,
  glowColor,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative px-4 py-2 text-lg font-bold rounded-lg shadow-lg overflow-hidden m-4 transition-colors duration-300"
      style={{
        backgroundColor: primaryColor,
        color: secondaryColor,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="relative z-10"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>

      {/* Smooth glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: glowColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Smooth data stream effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent, ${secondaryColor}30, transparent)`,
          width: "200%",
        }}
        animate={{
          x: ["-100%", "0%"],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Professional hover effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{ backgroundColor: secondaryColor }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function ProfessionalMonochromeButtonsComponent() {
  return (
    <div className="">
      {/* <ProfessionalMonochromeButton
        text="Obsidian"
        primaryColor="#000000"
        secondaryColor="#ffffff"
        glowColor="#ffffff"
      />
      <ProfessionalMonochromeButton
        text="Charcoal"
        primaryColor="#333333"
        secondaryColor="#ffffff"
        glowColor="#ffffff"
      />
      <ProfessionalMonochromeButton
        text="Silver"
        primaryColor="#cccccc"
        secondaryColor="#000000"
        glowColor="#000000"
      />
      <ProfessionalMonochromeButton
        text="Smoke"
        primaryColor="#888888"
        secondaryColor="#ffffff"
        glowColor="#ffffff"
      /> */}
      <ProfessionalMonochromeButton
        text="Chat"
        primaryColor="#f5f5f5"
        secondaryColor="#000000"
        glowColor="#000000"
      />
    </div>
  );
}
