import { useState, useEffect } from 'react';
import { PassportData } from './types/passport';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';
import PassportBuilder from './components/PassportBuilder';
import FounderVoice from './components/FounderVoice';
import PassportComplete from './components/PassportComplete';

type Step = 'landing' | 'builder' | 'founder' | 'complete';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [passportData, setPassportData] = useState<PassportData>({
    hashName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLandingSubmit = (hashName: string, email: string) => {
    setPassportData({
      ...passportData,
      hashName,
      email,
    });
    setCurrentStep('builder');
  };

  const handleBuilderUpdate = (updates: Partial<PassportData>) => {
    setPassportData({
      ...passportData,
      ...updates,
    });
  };

  const handleBuilderNext = () => {
    setCurrentStep('founder');
  };

  const handleFounderUpdate = (feedback: string) => {
    setPassportData({
      ...passportData,
      founderFeedback: feedback,
    });
  };

  const handleFounderNext = async () => {
    setIsLoading(true);

    try {
      const { data: passport, error: passportError } = await supabase
        .from('passports')
        .insert({
          hash_name: passportData.hashName,
          email: passportData.email,
          origin_country: passportData.originCountry,
          home_kennel_city: passportData.homeKennelCity,
          home_kennel_country: passportData.homeKennelCountry,
          run_count_category: passportData.runCountCategory,
          founder_feedback: passportData.founderFeedback,
          photo_url: passportData.photoUrl,
        })
        .select()
        .maybeSingle();

      if (passportError) throw passportError;

      if (passport && passportData.visitedLocations && passportData.visitedLocations.length > 0) {
        const locationsData = passportData.visitedLocations.map((loc) => ({
          passport_id: passport.id,
          country: loc.country,
          city: loc.city,
          latitude: loc.latitude,
          longitude: loc.longitude,
        }));

        const { error: locationsError } = await supabase
          .from('passport_locations')
          .insert(locationsData);

        if (locationsError) throw locationsError;
      }

      setCurrentStep('complete');
    } catch (error) {
      console.error('Error saving passport:', error);
      alert('There was an error saving your passport. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Creating your passport...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentStep === 'landing' && <LandingPage onSubmit={handleLandingSubmit} />}
      {currentStep === 'builder' && (
        <PassportBuilder
          passportData={passportData}
          onUpdate={handleBuilderUpdate}
          onNext={handleBuilderNext}
        />
      )}
      {currentStep === 'founder' && (
        <FounderVoice
          feedback={passportData.founderFeedback || ''}
          onUpdate={handleFounderUpdate}
          onNext={handleFounderNext}
        />
      )}
      {currentStep === 'complete' && <PassportComplete passportData={passportData} />}
    </>
  );
}

export default App;
