"use client";

import { useMemo, useState } from "react";
import { FlashcardInput } from "../components/FlashcardInput";
import { FlashcardDisplay, Card } from "../components/FlashcardDisplay";

const MIN_CHARS = 50;
const MAX_CHARS = 8000;
const DEBOUNCE_MS = 800;
const TIMEOUT_MS = 15000;

export default function Page() {
  const [text, setText] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const hasCards = useMemo(() => cards.length > 0, [cards]);

  const handleGenerate = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please paste your study material first.");
      return;
    }
    if (trimmed.length < MIN_CHARS) {
      setError("Please provide at least 50 characters for better flashcards.");
      return;
    }
    if (loading) return;

    const now = Date.now();
    if (now - lastSubmit < DEBOUNCE_MS) {
      return;
    }
    setLastSubmit(now);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: trimmed }),
        signal: controller.signal
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ?? "Unable to generate flashcards right now."
        );
      }

      if (!data?.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
        throw new Error("No cards were returned. Please try again.");
      }

      setCards(
        data.cards.map((card: Card) => ({
          front: card.front,
          back: card.back
        }))
      );
      setCurrentIndex(0);
    } catch (err) {
      if ((err as DOMException).name === "AbortError") {
        setError("Request took too long. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCards([]);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2 text-center md:text-left">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
          FlashAI
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Generate smart flashcards from any text
        </h1>
        <p className="text-slate-600">
          Paste your notes, let AI write the questions, and flip through concise
          answers. Perfect for quick study sessions.
        </p>
      </header>

      <FlashcardInput
        text={text}
        maxLength={MAX_CHARS}
        minLength={MIN_CHARS}
        loading={loading}
        error={error}
        onChange={setText}
        onSubmit={handleGenerate}
      />

      {hasCards ? (
        <FlashcardDisplay
          cards={cards}
          currentIndex={currentIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onReset={handleReset}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-600 bg-white">
          Your cards will appear here after generation.
        </div>
      )}
    </main>
  );
}
