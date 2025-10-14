import { useState } from 'react';
import { ChevronRight, Flag, Home, Map, Award, Camera } from 'lucide-react';
import { PassportData, COUNTRIES, POPULAR_KENNELS, RUN_COUNT_OPTIONS } from '../types/passport';
import WorldMap from './WorldMap';
import PhotoUpload from './PhotoUpload';

interface PassportBuilderProps {
  passportData: PassportData;
  onUpdate: (data: Partial<PassportData>) => void;
  onNext: () => void;
}

export default function PassportBuilder({ passportData, onUpdate, onNext }: PassportBuilderProps) {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [manualCountry, setManualCountry] = useState('');
  const [manualKennelCountry, setManualKennelCountry] = useState('');
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);

  const handleToggleCountry = (country: string) => {
    const updated = visitedCountries.includes(country)
      ? visitedCountries.filter((c) => c !== country)
      : [...visitedCountries, country];
    setVisitedCountries(updated);
    onUpdate({
      visitedLocations: updated.map((c) => ({ country: c })),
    });
  };

  const blocks = [
    {
      id: 0,
      icon: Flag,
      title: 'Where are your roots?',
      subtitle: 'What country are you originally from?',
      content: (
        <div className="space-y-4">
          <select
            value={passportData.originCountry || ''}
            onChange={(e) => {
              if (e.target.value === 'manual') {
                setManualCountry('');
              } else {
                onUpdate({ originCountry: e.target.value });
              }
            }}
            className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
            <option value="manual">Enter manually</option>
          </select>

          {passportData.originCountry === 'manual' && (
            <input
              type="text"
              value={manualCountry}
              onChange={(e) => {
                setManualCountry(e.target.value);
                onUpdate({ originCountry: e.target.value });
              }}
              placeholder="Enter your country"
              className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
            />
          )}
        </div>
      ),
      canProceed: !!passportData.originCountry,
    },
    {
      id: 1,
      icon: Home,
      title: 'Home Kennel',
      subtitle: 'Which country/city is your kennel in?',
      content: (
        <div className="space-y-4">
          <select
            value={passportData.homeKennelCountry || ''}
            onChange={(e) => {
              if (e.target.value === 'manual') {
                setManualKennelCountry('');
                onUpdate({ homeKennelCountry: '', homeKennelCity: '' });
              } else {
                onUpdate({ homeKennelCountry: e.target.value, homeKennelCity: '' });
              }
            }}
            className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
            <option value="manual">Enter manually</option>
          </select>

          {passportData.homeKennelCountry === 'manual' && (
            <input
              type="text"
              value={manualKennelCountry}
              onChange={(e) => {
                setManualKennelCountry(e.target.value);
                onUpdate({ homeKennelCountry: e.target.value });
              }}
              placeholder="Enter country"
              className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
            />
          )}

          {passportData.homeKennelCountry &&
            passportData.homeKennelCountry !== 'manual' &&
            POPULAR_KENNELS[passportData.homeKennelCountry] && (
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                  Popular kennels in {passportData.homeKennelCountry}
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {POPULAR_KENNELS[passportData.homeKennelCountry].map((city) => (
                    <button
                      key={city}
                      onClick={() => onUpdate({ homeKennelCity: city })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        passportData.homeKennelCity === city
                          ? 'bg-[#CCFF00] text-[#1C1C1E]'
                          : 'bg-[#1C1C1E] text-[#E0E0E0] hover:bg-[#3A3A3C]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <input
            type="text"
            value={passportData.homeKennelCity || ''}
            onChange={(e) => onUpdate({ homeKennelCity: e.target.value })}
            placeholder="Or enter city manually"
            className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 transition-all"
          />
        </div>
      ),
      canProceed: !!passportData.homeKennelCountry && !!passportData.homeKennelCity,
    },
    {
      id: 2,
      icon: Map,
      title: 'Where Have You Left Your Pawprints?',
      subtitle: 'Mark on the map the countries or cities where you’ve taken part in runs',
      content: (
        <WorldMap selectedCountries={visitedCountries} onToggleCountry={handleToggleCountry} />
      ),
      canProceed: visitedCountries.length > 0,
    },
    {
      id: 3,
      icon: Camera,
      title: 'Your Hash Look',
      subtitle: 'Upload a photo or generate your hash avatar with AI',
      content: (
        <PhotoUpload
          currentPhoto={passportData.photoUrl}
          onPhotoUpdate={(photoUrl) => onUpdate({ photoUrl })}
          hashName={passportData.hashName}
        />
      ),
      canProceed: true,
    },
    {
      id: 4,
      icon: Award,
      title: 'Define Your Status',
      subtitle: 'How many runs have you done so far?',
      content: (
        <div className="space-y-3">
          {RUN_COUNT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ runCountCategory: option.value })}
              className={`w-full px-6 py-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
                passportData.runCountCategory === option.value
                  ? 'bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E]'
                  : 'bg-[#1C1C1E] text-[#E0E0E0] hover:bg-[#3A3A3C] border border-[#3A3A3C]'
              }`}
            >
              <span>{option.label}</span>
              <span className="text-2xl">{option.badge}</span>
            </button>
          ))}
        </div>
      ),
      canProceed: !!passportData.runCountCategory,
    },
  ];

  const currentBlockData = blocks[currentBlock];
  const Icon = currentBlockData.icon;

  const handleNext = () => {
    if (currentBlock < blocks.length - 1) {
      setCurrentBlock(currentBlock + 1);
    } else {
      onNext();
    }
  };

  const progress = ((currentBlock + 1) / blocks.length) * 100;

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#E0E0E0]">
              Hello, <span className="text-[#CCFF00]">{passportData.hashName}</span>!
            </h2>
            <span className="text-sm text-gray-400">
              Step {currentBlock + 1} of {blocks.length}
            </span>
          </div>
          <p className="text-[#E0E0E0] mb-4">
            Your Hash Passport is being assembled right now. Complete it with the stamps of your story.
          </p>

          <div className="w-full bg-[#2C2C2E] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#CCFF00] to-[#FF289B] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-[#2C2C2E] rounded-2xl p-8 shadow-2xl border border-[#3A3A3C] mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#FF289B] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#1C1C1E]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#E0E0E0]">{currentBlockData.title}</h3>
              <p className="text-sm text-gray-400">{currentBlockData.subtitle}</p>
            </div>
          </div>

          {currentBlockData.content}
        </div>

        <div className="flex justify-between">
          {currentBlock > 0 && (
            <button
              onClick={() => setCurrentBlock(currentBlock - 1)}
              className="px-6 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!currentBlockData.canProceed}
            className={`ml-auto px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              currentBlockData.canProceed
                ? 'bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] hover:shadow-lg hover:shadow-[#CCFF00]/20'
                : 'bg-[#2C2C2E] text-gray-500 cursor-not-allowed border border-[#3A3A3C]'
            }`}
          >
            {currentBlock < blocks.length - 1 ? 'Next' : 'Create Passport'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
