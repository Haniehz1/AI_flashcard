import { FlashcardCard } from "./FlashcardCard";

export type Card = {
  front: string;
  back: string;
};

type FlashcardDisplayProps = {
  cards: Card[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
};

export function FlashcardDisplay({
  cards,
  currentIndex,
  onPrevious,
  onNext,
  onReset
}: FlashcardDisplayProps) {
  if (!cards.length) {
    return null;
  }

  const current = cards[currentIndex];

  return (
    <section className="space-y-6">
      <FlashcardCard front={current.front} back={current.back} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-slate-600 text-center sm:text-left">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-300 transition"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === cards.length - 1}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-300 transition"
          >
            Next
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-sm rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
          >
            New set
          </button>
        </div>
      </div>
    </section>
  );
}
