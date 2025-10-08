import { useRef } from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';
import { PassportData } from '../types/passport';
import PassportCard from './PassportCard';
import html2canvas from 'html2canvas';

interface PassportCompleteProps {
  passportData: PassportData;
}

export default function PassportComplete({ passportData }: PassportCompleteProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1C1C1E',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `hash-passport-${passportData.hashName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating passport image:', error);
    }
  };

  const handleShare = async () => {
    const shareText = `I just created my Hash Passport on Hasher.AI! I'm part of Founder Season One 🏃\n\nHash Name: ${passportData.hashName}\nStatus: ${passportData.runCountCategory}\nCountries visited: ${passportData.visitedLocations?.length || 0}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Hash Passport',
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Passport info copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#CCFF00] to-[#FF289B] rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-[#1C1C1E]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Passport is Ready,{' '}
            <span className="bg-gradient-to-r from-[#CCFF00] via-[#FF289B] to-[#B285FD] bg-clip-text text-transparent">
              {passportData.hashName}
            </span>
            !
          </h1>

          <div className="max-w-2xl mx-auto space-y-4 text-[#E0E0E0]">
            <p className="text-lg leading-relaxed">
              Congratulations — you're officially part of <span className="font-bold text-[#CCFF00]">Founder Season One</span>.
            </p>
            <p className="leading-relaxed">
              Thank you for contributing to the growth of our ecosystem. Your ideas and feedback
              help keep the spirit of hashing alive for future generations.
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <PassportCard ref={cardRef} passportData={passportData} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleDownload}
            className="px-8 py-4 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Passport
          </button>

          <button
            onClick={handleShare}
            className="px-8 py-4 bg-[#2C2C2E] text-white font-medium rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share with Friends
          </button>
        </div>

        <div className="bg-[#2C2C2E] rounded-2xl p-8 border border-[#3A3A3C] max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-[#E0E0E0]">Your Founder's Voice</h3>
          {passportData.founderFeedback ? (
            <blockquote className="text-[#E0E0E0] italic leading-relaxed border-l-4 border-[#CCFF00] pl-4">
              "{passportData.founderFeedback}"
            </blockquote>
          ) : (
            <p className="text-gray-400">No feedback provided</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 leading-relaxed">
            Your passport will become part of Hasher.AI's digital history.
            <br />
            Share it and show that you are one of the first to build the future of hashing.
          </p>
        </div>
      </div>
    </div>
  );
}
