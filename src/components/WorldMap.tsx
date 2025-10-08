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

            <g opacity="0.25" stroke="#4A4A4C" strokeWidth="1.5" fill="none">
              <path d="M 100,80 L 180,75 L 220,95 L 240,130 L 200,145 L 130,135 L 90,110 Z" />
              <path d="M 220,95 L 310,88 L 380,110 L 400,150 L 370,180 L 290,175 L 240,145 Z" />
              <path d="M 400,100 L 490,95 L 580,115 L 600,160 L 570,190 L 480,185 L 420,155 Z" />
              <path d="M 600,110 L 700,105 L 780,125 L 810,170 L 775,205 L 680,200 L 620,165 Z" />
              <path d="M 810,130 L 890,125 L 950,145 L 960,185 L 920,210 L 830,205 L 810,175 Z" />

              <path d="M 90,180 L 180,175 L 240,195 L 260,235 L 225,265 L 140,260 L 85,230 Z" />
              <path d="M 240,195 L 330,190 L 410,215 L 430,260 L 390,295 L 300,290 L 255,250 Z" />
              <path d="M 430,210 L 530,205 L 620,230 L 640,280 L 600,315 L 510,310 L 445,265 Z" />
              <path d="M 640,225 L 740,220 L 820,245 L 845,295 L 805,330 L 710,325 L 655,280 Z" />
              <path d="M 845,240 L 930,235 L 975,255 L 985,295 L 945,325 L 860,320 L 845,285 Z" />

              <path d="M 140,300 L 230,295 L 285,315 L 305,355 L 270,385 L 185,380 L 135,345 Z" />
              <path d="M 285,315 L 385,310 L 460,335 L 480,380 L 440,415 L 350,410 L 300,365 Z" />
              <path d="M 480,330 L 580,325 L 650,350 L 670,400 L 630,435 L 540,430 L 495,385 Z" />
              <path d="M 670,345 L 760,340 L 830,365 L 850,410 L 810,445 L 720,440 L 685,395 Z" />

              <ellipse cx="150" cy="110" rx="35" ry="25" />
              <ellipse cx="550" cy="160" rx="40" ry="28" />
              <ellipse cx="750" cy="280" rx="38" ry="26" />
              <ellipse cx="360" cy="360" rx="32" ry="22" />
              <circle cx="880" cy="180" r="22" />
              <circle cx="600" cy="385" r="20" />
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
