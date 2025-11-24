"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type FlashcardCardProps = {
  front: string;
  back: string;
};

export function FlashcardCard({ front, back }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [front, back]);

  return (
    <div
      className={clsx(
        "flip-card w-full max-w-xl mx-auto cursor-pointer",
        flipped && "flipped"
      )}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div className="flip-inner relative h-72 rounded-2xl shadow-card">
        <div className="flip-face card-surface absolute inset-0 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between">
          <p className="text-slate-900 text-lg leading-relaxed">{front}</p>
          <span className="text-sm font-medium text-indigo-600">
            Tap to reveal answer
          </span>
        </div>

        <div className="flip-face back absolute inset-0 rounded-2xl bg-indigo-600 text-white p-8 flex flex-col justify-between">
          <p className="text-lg leading-relaxed text-indigo-50">{back}</p>
          <span className="text-sm font-medium text-indigo-200">
            Tap to see question
          </span>
        </div>
      </div>
    </div>
  );
}
