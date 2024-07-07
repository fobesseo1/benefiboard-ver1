'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPointCounterProps {
  currentPoints: number;
  addedPoints: number;
  onAnimationComplete?: () => void;
}

const AnimatedPointCounter: React.FC<AnimatedPointCounterProps> = ({
  currentPoints,
  addedPoints,
  onAnimationComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(currentPoints);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (addedPoints > 0) {
      setIsAnimating(true);
      setDisplayedPoints(currentPoints + addedPoints);

      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2000); // Animation duration

      const visibilityTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Auto-close after 5 seconds

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(visibilityTimer);
      };
    }
  }, [addedPoints, onAnimationComplete, currentPoints]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="z-50 fixed flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="relative flex items-center justify-between text-3xl font-semibold w-72 h-20 bg-emerald-300 rounded-lg px-4">
        <AnimatePresence>
          {isAnimating ? (
            <motion.div
              key="animating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {displayedPoints}
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {displayedPoints}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleClose}
          className="absolute -top-3 right-1 text-sm bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </div>
    </motion.div>
  );
};

export default AnimatedPointCounter;
