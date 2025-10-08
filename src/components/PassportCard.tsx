import { forwardRef } from 'react';
import { Award, MapPin, Flag } from 'lucide-react';
import { PassportData, RUN_COUNT_OPTIONS } from '../types/passport';
import { getCountryFlag } from '../utils/countryFlags';

interface PassportCardProps {
  passportData: PassportData;
}

const PassportCard = forwardRef<HTMLDivElement, PassportCardProps>(({ passportData }, ref) => {
  const statusOption = RUN_COUNT_OPTIONS.find(
    (opt) => opt.value === passportData.runCountCategory
  );

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      ref={ref}
      className="w-full max-w-2xl bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] rounded-3xl p-8 shadow-2xl border-2 border-[#3A3A3C] relative overflow-hidden"
      style={{ aspectRatio: '16/10' }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#CCFF00]/10 to-[#FF289B]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#B285FD]/10 to-[#CCFF00]/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {passportData.photoUrl && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#3A3A3C] flex-shrink-0 bg-[#1C1C1E]">
                <img
                  src={passportData.photoUrl}
                  alt={passportData.hashName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] rounded-full mb-3">
                <p className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider">
                  Founder Season One
                </p>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                {passportData.originCountry && (
                  <span className="text-2xl">{getCountryFlag(passportData.originCountry)}</span>
                )}
                {passportData.hashName}
              </h2>
              <p className="text-[#E0E0E0] text-sm">Hash Passport</p>
            </div>
          </div>

          {statusOption && (
            <div className="text-right">
              <div className="text-4xl mb-1">{statusOption.badge}</div>
              <p className="text-xs font-semibold text-[#CCFF00]">
                {statusOption.value.split(' ')[0]}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1C1C1E]/50 rounded-xl p-4 backdrop-blur-sm border border-[#3A3A3C]">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-4 h-4 text-[#CCFF00]" />
              <p className="text-xs text-gray-400 uppercase tracking-wide">From</p>
            </div>
            <p className="text-sm font-semibold text-white">
              {passportData.originCountry || 'Unknown'}
            </p>
          </div>

          <div className="bg-[#1C1C1E]/50 rounded-xl p-4 backdrop-blur-sm border border-[#3A3A3C]">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#FF289B]" />
              <p className="text-xs text-gray-400 uppercase tracking-wide">Home Kennel</p>
            </div>
            <p className="text-sm font-semibold text-white">
              {passportData.homeKennelCity && passportData.homeKennelCountry
                ? `${passportData.homeKennelCity}, ${passportData.homeKennelCountry}`
                : 'Unknown'}
            </p>
          </div>
        </div>

        {passportData.visitedLocations && passportData.visitedLocations.length > 0 && (
          <div className="bg-[#1C1C1E]/50 rounded-xl p-4 backdrop-blur-sm border border-[#3A3A3C] mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B285FD]" />
                <p className="text-xs text-gray-400 uppercase tracking-wide">Hash Journey</p>
              </div>
              <p className="text-lg font-bold text-[#CCFF00]">
                {passportData.visitedLocations.length} countries
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {passportData.visitedLocations.slice(0, 8).map((location, idx) => (
                <span key={idx} className="text-xl">
                  {getCountryFlag(location.country)}
                </span>
              ))}
              {passportData.visitedLocations.length > 8 && (
                <span className="text-xs text-gray-400 self-center">
                  +{passportData.visitedLocations.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Issued</p>
            <p className="text-sm font-semibold text-[#E0E0E0]">{formatDate()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-[#B285FD] uppercase tracking-wider">
              Hasher.AI
            </p>
            <p className="text-xs text-gray-400">Digital Passport</p>
          </div>
        </div>
      </div>
    </div>
  );
});

PassportCard.displayName = 'PassportCard';

export default PassportCard;
