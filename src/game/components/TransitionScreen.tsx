import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface TransitionScreenProps {
  onComplete: () => void;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <img
          src="/assets/spark_car.webp"
          alt="Spark Car"
          className="w-48 h-48 object-contain"
        />
        <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-widest">
          Гоним в студию
        </h2>
      </motion.div>
    </motion.div>
  );
};
