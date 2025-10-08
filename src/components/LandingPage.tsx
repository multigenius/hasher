import { useState } from 'react';
import { Users } from 'lucide-react';

interface LandingPageProps {
  onSubmit: (hashName: string, email: string) => void;
}

export default function LandingPage({ onSubmit }: LandingPageProps) {
  const [hashName, setHashName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ hashName?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { hashName?: string; email?: string } = {};

    if (!hashName.trim()) {
      newErrors.hashName = 'Hash name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(hashName, email);
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#CCFF00] to-[#FF289B] rounded-full mb-6">
            <Users className="w-10 h-10 text-[#1C1C1E]" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#CCFF00] via-[#FF289B] to-[#B285FD] bg-clip-text text-transparent">
            Your Hash Biography
          </h1>

          <p className="text-2xl text-[#B285FD] font-semibold mb-6">
            Founder Season One
          </p>

          <p className="text-lg text-[#E0E0E0] max-w-xl mx-auto">
            Get your digital hasher passport and become part of hashing history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#2C2C2E] rounded-2xl p-8 shadow-2xl border border-[#3A3A3C]">
            <div className="space-y-6">
              <div>
                <label htmlFor="hashName" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                  Hash Name
                </label>
                <input
                  type="text"
                  id="hashName"
                  value={hashName}
                  onChange={(e) => {
                    setHashName(e.target.value);
                    setErrors((prev) => ({ ...prev, hashName: undefined }));
                  }}
                  placeholder="Running Deer"
                  className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
                />
                {errors.hashName && (
                  <p className="mt-2 text-sm text-[#FF289B]">{errors.hashName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="my@email.com"
                  className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-[#FF289B]">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Create My Passport
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Join the first generation of digital hashers
          </p>
        </div>
      </div>
    </div>
  );
}
