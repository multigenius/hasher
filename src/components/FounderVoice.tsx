import { useState } from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface FounderVoiceProps {
  feedback: string;
  onUpdate: (feedback: string) => void;
  onNext: () => void;
}

export default function FounderVoice({ feedback, onUpdate, onNext }: FounderVoiceProps) {
  const [localFeedback, setLocalFeedback] = useState(feedback);

  const examplePrompts = [
    "Remember, hashing is about people, not apps. Any feature should help us meet — not replace the meetings.",
    "The main thing is to keep room for chaos and silliness! Don’t try to digitize and organize absolutely everything.",
    "Pay special attention to visitors. Make joining a new kennel feel as easy and friendly as visiting old friends.",
  ];

  const handleSubmit = () => {
    onUpdate(localFeedback);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#B285FD] to-[#FF289B] rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#CCFF00] via-[#FF289B] to-[#B285FD] bg-clip-text text-transparent">
            Your Founder's Voice
          </h1>
        </div>

        <div className="bg-[#2C2C2E] rounded-2xl p-8 shadow-2xl border border-[#3A3A3C] mb-6">
          <p className="text-[#E0E0E0] mb-6 leading-relaxed">
            You’re among the first to help build the digital history of hashing.
            What do you think is the true magic of hashing?
            How can we preserve and amplify it through technology?
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#E0E0E0] mb-3">
              Share your thoughts
            </label>
            <textarea
              value={localFeedback}
              onChange={(e) => setLocalFeedback(e.target.value)}
              placeholder="Your vision for the future of hashing..."
              rows={8}
              className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all resize-none"
            />
            <p className="mt-2 text-xs text-gray-400">
              {localFeedback.length} characters
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#E0E0E0]">
              Need inspiration? Here are some thoughts from the community:
            </p>
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setLocalFeedback(prompt)}
                className="w-full text-left px-4 py-3 bg-[#1C1C1E] rounded-lg text-sm text-gray-400 hover:text-[#CCFF00] hover:bg-[#2C2C2E] border border-[#3A3A3C] hover:border-[#CCFF00]/30 transition-all"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!localFeedback.trim()}
            className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              localFeedback.trim()
                ? 'bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] hover:shadow-lg hover:shadow-[#CCFF00]/20'
                : 'bg-[#2C2C2E] text-gray-500 cursor-not-allowed border border-[#3A3A3C]'
            }`}
          >
            Complete My Passport
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
