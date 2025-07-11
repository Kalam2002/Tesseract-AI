'use client';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-700 blur-3xl opacity-30 animate-pulse rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500 blur-3xl opacity-30 animate-ping rounded-full" />
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-pink-600 blur-2xl opacity-20 animate-spin rounded-full" />
      </div>

      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text mb-4"
        >
          Welcome to TESSERACT 🧠
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-400 text-lg mb-8"
        >
          Your AI assistant is ready to think beyond dimensions.
        </motion.p>

        <motion.a
          href="/new-chat"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Start Chatting
        </motion.a>
      </div>
    </div>
  );
}
