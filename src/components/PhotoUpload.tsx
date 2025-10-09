import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (photoUrl: string) => void;
  hashName: string;
}

export default function PhotoUpload({ currentPhoto, onPhotoUpdate, hashName }: PhotoUploadProps) {
  const [uploadMode, setUploadMode] = useState<'select' | 'upload' | 'ai'>('select');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('passport-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('passport-photos')
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onPhotoUpdate(data.publicUrl);
      setUploadMode('select');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) {
      alert('Please describe what you want your passport photo to look like');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = aiPrompt;

      const response = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt), {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const blob = await response.blob();

      const fileName = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const { error: uploadError } = await supabase.storage
        .from('passport-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('passport-photos')
        .getPublicUrl(fileName);

      setPreviewUrl(data.publicUrl);
      onPhotoUpdate(data.publicUrl);
      setUploadMode('select');
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI photo:', error);
      alert('Failed to generate photo. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    onPhotoUpdate('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadMode === 'select') {
    return (
      <div className="space-y-4">
        {previewUrl ? (
          <div className="relative">
            <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-[#3A3A3C] bg-[#1C1C1E]">
              <img
                src={previewUrl}
                alt="Passport photo"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-[#3A3A3C] bg-[#1C1C1E] flex items-center justify-center">
            <div className="text-center p-8">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No photo yet</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setUploadMode('upload')}
            className="px-6 py-4 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>

          <button
            onClick={() => setUploadMode('ai')}
            className="px-6 py-4 bg-gradient-to-r from-[#B285FD] to-[#FF289B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#B285FD]/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate with AI
          </button>
        </div>
      </div>
    );
  }

  if (uploadMode === 'upload') {
    return (
      <div className="space-y-4">
        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-[#3A3A3C]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#CCFF00]" />
            Upload Your Photo
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#CCFF00] file:text-[#1C1C1E] hover:file:bg-[#CCFF00]/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <p className="text-xs text-gray-400 mt-3">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>

          {isUploading && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-3 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#E0E0E0]">Uploading...</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isUploading}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (uploadMode === 'ai') {
    const promptSuggestions = [
      {
        title: "NeoHash Portrait",
        prompt: "A cinematic portrait of a hash runner, realistic facial likeness, wet skin highlights, soft sunlight, dynamic depth, trail dust and faint beer bubbles in the air, digital glow ambiance, natural but enhanced aesthetics, ultra-detailed textures, expressive atmosphere"
      },
      {
        title: "Trail Hero Mode",
        prompt: "A semi-realistic artistic depiction of a trail hero, dynamic composition, motion energy, forest or coastal trail environment, reflective sweat and dirt textures, cinematic lighting, expressive brush-like rendering, epic and natural"
      },
      {
        title: "Hash Afterparty Glow",
        prompt: "Realistic yet artistic portrait in a relaxed after-run pub scene, golden warm lighting, reflective beer glass glow, laughing expression, cinematic composition, digital painting style, lively atmosphere"
      },
      {
        title: "Mythic Trail Persona",
        prompt: "Stylized artistic depiction of a Trail Spirit, forest background, glowing On-On symbols in the mist, surreal light, soft painterly texture, ethereal yet grounded mood"
      },
      {
        title: "Event Poster Style",
        prompt: "Stylish cinematic poster of hash runners on a trail near the sea, dynamic composition, warm light, soft focus, symbolic On-On arrows, suitable for title overlay"
      },
      {
        title: "HashBot Future ID",
        prompt: "A futuristic digital avatar, glowing geometric elements, metallic reflections, soft AI-light glow, abstract background referencing trails and motion, cinematic contrast"
      }
    ];

    return (
      <div className="space-y-4">
        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-[#3A3A3C]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B285FD]" />
            Generate Photo with AI
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Choose a prompt or write your own
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setAiPrompt(suggestion.prompt)}
                    disabled={isGenerating}
                    className="px-3 py-2 bg-[#2C2C2E] text-[#E0E0E0] text-xs text-left rounded-lg border border-[#3A3A3C] hover:bg-[#3A3A3C] hover:border-[#CCFF00] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-semibold mb-1">{suggestion.title}</div>
                    <div className="text-gray-500 text-[10px] leading-tight line-clamp-2">{suggestion.prompt.substring(0, 60)}...</div>
                  </button>
                ))}
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your hash running scene: trail running in the forest, celebrating with beer after a run, jumping over obstacles, etc."
                rows={4}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B285FD] focus:ring-2 focus:ring-[#B285FD]/20 transition-all resize-none disabled:opacity-50"
              />
            </div>

            <div className="bg-[#2C2C2E] rounded-lg p-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Tip: Choose a hash-themed preset or describe your own scene. Think action, celebration, trails, and the spirit of hashing. The AI will create a unique image for your passport.
              </p>
            </div>

            <button
              onClick={handleAIGeneration}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#B285FD] to-[#FF289B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#B285FD]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Photo
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  return null;
}
