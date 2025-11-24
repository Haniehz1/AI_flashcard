import { useState } from 'react';
import { motion } from 'motion/react';

interface FlashCardProps {
  question: string;
  answer: string;
}

export function FlashCard({ question, answer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-md perspective">
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center backface-hidden border border-gray-100"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="text-center space-y-4">
            <p className="text-gray-900">{question}</p>
            <p className="text-indigo-600">Tap to reveal answer</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center space-y-4">
            <p className="text-white">{answer}</p>
            <p className="text-indigo-200">Tap to see question</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
