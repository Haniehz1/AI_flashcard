import { ChangeEvent } from "react";
import clsx from "clsx";

type FlashcardInputProps = {
  text: string;
  maxLength: number;
  minLength: number;
  loading: boolean;
  error: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function FlashcardInput({
  text,
  maxLength,
  minLength,
  loading,
  error,
  onChange,
  onSubmit
}: FlashcardInputProps) {
  const chars = text.length;
  const belowMinimum = chars > 0 && chars < minLength;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value.slice(0, maxLength));
  };

  return (
    <section className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Study material
          </h2>
          <p className="text-sm text-slate-600">
            Paste your notes or lecture text and generate flashcards instantly.
          </p>
        </div>
        <span className="text-xs text-slate-500">
          {chars.toLocaleString()} / {maxLength.toLocaleString()} chars
        </span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Example: Photosynthesis is the process by which green plants use sunlight..."
        className="w-full h-48 resize-none rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-4 text-slate-900 bg-slate-50"
      />

      <div className="space-y-2">
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {belowMinimum && !error && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            Add at least {minLength - chars} more characters for better cards.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || text.trim().length === 0}
        className={clsx(
          "inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
        )}
        {loading ? "Generating flashcards..." : "Generate flashcards"}
      </button>
    </section>
  );
}
