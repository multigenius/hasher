import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { getCountryCoordinates } from '../utils/countryFlags';
import { COUNTRIES } from '../types/passport';

interface WorldMapProps {
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
}

export default function WorldMap({ selectedCountries, onToggleCountry }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getMarkerPosition = (country: string) => {
    const coords = getCountryCoordinates(country);
    const x = ((coords.lng + 180) / 360) * 100;
    const y = ((90 - coords.lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-[#2C2C2E] rounded-2xl p-4 overflow-hidden border border-[#3A3A3C]">
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'drop-shadow(0 0 20px rgba(204, 255, 0, 0.1))' }}
          >
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A3A3C" />
                <stop offset="100%" stopColor="#2C2C2E" />
              </linearGradient>
            </defs>

            <rect width="1000" height="500" fill="url(#mapGradient)" rx="20" />

            <g opacity="0.3">
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#4A4A4C" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="250" y1="0" x2="250" y2="500" stroke="#4A4A4C" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="#4A4A4C" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="750" y1="0" x2="750" y2="500" stroke="#4A4A4C" strokeWidth="1" strokeDasharray="5,5" />
            </g>

            <g opacity="0.4" stroke="#5A5A5C" strokeWidth="1" fill="none">
              <path d="M 150,100 L 250,90 L 300,120 L 280,160 L 200,150 Z" />
              <path d="M 300,120 L 400,110 L 450,140 L 420,180 L 350,170 L 320,150 Z" />
              <path d="M 450,140 L 550,130 L 620,150 L 600,200 L 500,190 Z" />
              <path d="M 620,150 L 720,140 L 780,160 L 750,210 L 650,200 Z" />
              <path d="M 100,200 L 200,190 L 250,220 L 230,270 L 150,260 Z" />
              <path d="M 250,220 L 350,210 L 420,240 L 400,290 L 300,280 Z" />
              <path d="M 420,240 L 520,230 L 580,260 L 560,310 L 450,300 Z" />
              <path d="M 580,260 L 680,250 L 750,270 L 720,320 L 620,310 Z" />
              <path d="M 200,300 L 300,290 L 350,320 L 330,370 L 250,360 Z" />
              <path d="M 350,320 L 450,310 L 520,340 L 500,390 L 400,380 Z" />
              <path d="M 520,340 L 620,330 L 680,360 L 660,410 L 560,400 Z" />
              <ellipse cx="180" cy="150" rx="40" ry="30" />
              <ellipse cx="380" cy="240" rx="50" ry="35" />
              <ellipse cx="650" cy="280" rx="45" ry="32" />
              <ellipse cx="280" cy="350" rx="35" ry="25" />
              <path d="M 750,180 Q 800,200 850,180 T 900,200" />
              <path d="M 50,250 Q 100,280 150,260" />
              <circle cx="720" cy="360" r="25" />
              <circle cx="820" cy="300" r="20" />
            </g>

            {selectedCountries.map((country) => {
              const pos = getMarkerPosition(country);
              const isHovered = hoveredCountry === country;

              return (
                <g key={country}>
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 5}
                    r={isHovered ? 8 : 6}
                    fill="#CCFF00"
                    opacity={isHovered ? 1 : 0.8}
                    className="transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 5}
                    r={isHovered ? 12 : 10}
                    fill="none"
                    stroke="#CCFF00"
                    strokeWidth="2"
                    opacity={isHovered ? 0.6 : 0.3}
                    className="transition-all"
                  />
                  {isHovered && (
                    <text
                      x={pos.x * 10}
                      y={pos.y * 5 - 15}
                      textAnchor="middle"
                      fill="#CCFF00"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {country}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#E0E0E0]">
            <span className="text-[#CCFF00] font-bold text-lg">{selectedCountries.length}</span> countries marked
          </p>
        </div>
      </div>

      <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-[#3A3A3C]">
        <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#CCFF00]" />
          Select Countries
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => onToggleCountry(country)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCountries.includes(country)
                  ? 'bg-[#CCFF00] text-[#1C1C1E]'
                  : 'bg-[#1C1C1E] text-[#E0E0E0] hover:bg-[#3A3A3C]'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
