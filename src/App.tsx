import { useState } from 'react';
import { FlashCard } from './components/FlashCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Card {
  question: string;
  answer: string;
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock AI generation function
  const generateFlashcards = async () => {
    if (!inputText.trim()) {
      setError('Please enter some study material first');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock generated flashcards
    const mockCards: Card[] = [
      {
        question: 'What is photosynthesis?',
        answer: 'The process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.'
      },
      {
        question: 'What are the main products of photosynthesis?',
        answer: 'Glucose (sugar) and oxygen gas.'
      },
      {
        question: 'Where does photosynthesis take place?',
        answer: 'In the chloroplasts of plant cells, primarily in the leaves.'
      },
      {
        question: 'What is the chemical equation for photosynthesis?',
        answer: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂'
      },
      {
        question: 'What role does chlorophyll play?',
        answer: 'Chlorophyll absorbs light energy, primarily blue and red wavelengths, to power the photosynthesis process.'
      }
    ];

    setCards(mockCards);
    setCurrentCardIndex(0);
    setIsLoading(false);
  };

  const handlePrevious = () => {
    setCurrentCardIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentCardIndex(prev => Math.min(cards.length - 1, prev + 1));
  };

  const handleReset = () => {
    setCards([]);
    setInputText('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-indigo-600 mb-2">FlashAI</h1>
          <p className="text-gray-600">Transform your study material into smart flashcards instantly</p>
        </header>

        {/* Input Section */}
        {cards.length === 0 && (
          <>
            <div className="mb-4">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError('');
                }}
                placeholder="Paste your study material here..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateFlashcards}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating flashcards...
                </>
              ) : (
                'Generate Flashcards'
              )}
            </button>
          </>
        )}

        {/* Results Section */}
        {cards.length > 0 && (
          <div className="space-y-6">
            {/* Card Display */}
            <div className="flex justify-center">
              <FlashCard
                question={cards[currentCardIndex].question}
                answer={cards[currentCardIndex].answer}
              />
            </div>

            {/* Card Counter */}
            <div className="text-center">
              <p className="text-gray-600">
                {currentCardIndex + 1} of {cards.length}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentCardIndex === cards.length - 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next card"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Reset Button */}
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create New Set
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
