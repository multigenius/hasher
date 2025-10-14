import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, Palette, Shuffle, Shirt, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (photoUrl: string) => void;
  hashName: string;
}

type UploadMode = 'select' | 'upload-tryon' | 'ai-create' | 'anonymous' | 'customize';

const HASH_COLORS = [
  { name: 'Lime Green', value: '#CCFF00', bg: 'bg-[#CCFF00]' },
  { name: 'Hot Pink', value: '#FF289B', bg: 'bg-[#FF289B]' },
  { name: 'Electric Blue', value: '#00D4FF', bg: 'bg-[#00D4FF]' },
  { name: 'Neon Orange', value: '#FF6B00', bg: 'bg-[#FF6B00]' },
  { name: 'Purple', value: '#B285FD', bg: 'bg-[#B285FD]' },
  { name: 'Yellow', value: '#FFD700', bg: 'bg-[#FFD700]' },
];

const ACCESSORIES = [
  'sunglasses', 'headband', 'cap', 'backpack', 'water bottle', 'GPS watch'
];

const FILTERS = [
  { name: 'None', value: '' },
  { name: 'Cartoon', value: 'cartoon style, animated, vibrant colors' },
  { name: 'Comic Book', value: 'comic book art style, bold lines, pop art' },
  { name: 'Watercolor', value: 'watercolor painting style, soft edges, artistic' },
  { name: 'Pixel Art', value: '8-bit pixel art style, retro gaming aesthetic' },
];

export default function PhotoUpload({ currentPhoto, onPhotoUpdate, hashName }: PhotoUploadProps) {
  const [uploadMode, setUploadMode] = useState<UploadMode>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || '');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');

  const [selectedColor, setSelectedColor] = useState(HASH_COLORS[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToStorage = async (blob: Blob, filename: string): Promise<string> => {
    const file = new File([blob], filename, { type: 'image/jpeg' });

    const { error: uploadError } = await supabase.storage
      .from('passport-photos')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('passport-photos')
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  const handlePhotoUploadForTryOn = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsProcessing(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `original-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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

      setUploadedPhotoUrl(data.publicUrl);

      await applyHashLookToPhoto(data.publicUrl);

    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setIsProcessing(false);
    }
  };

  const applyHashLookToPhoto = async (photoUrl: string) => {
    setIsProcessing(true);

    try {
      const accessoriesText = selectedAccessories.length > 0
        ? `, wearing ${selectedAccessories.join(', ')}`
        : '';

      const filterText = selectedFilter.value ? `, ${selectedFilter.value}` : '';

      const prompt = `Transform this person into a hash runner wearing a bright ${selectedColor.name} running T-shirt with black hash symbols, black running shorts, colorful knee-high socks, and trail running sneakers${accessoriesText}. Action-oriented outdoor setting, trail running vibe, energetic and dynamic${filterText}. Keep the person's face recognizable.`;

      const imageParam = encodeURIComponent(photoUrl);
      const promptParam = encodeURIComponent(prompt);

      const response = await fetch(
        `https://image.pollinations.ai/prompt/${promptParam}?model=flux&enhance=true&nologo=true`,
        { method: 'GET' }
      );

      if (!response.ok) throw new Error('Failed to generate try-on image');

      const blob = await response.blob();
      const fileName = `tryon-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const publicUrl = await uploadToStorage(blob, fileName);

      setPreviewUrl(publicUrl);
      onPhotoUpdate(publicUrl);
      setUploadMode('customize');

    } catch (error) {
      console.error('Error applying hash look:', error);
      alert('Failed to apply hash look. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAICreateFromScratch = async (description: string) => {
    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }

    setIsProcessing(true);

    try {
      const prompt = description;
      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&enhance=true&nologo=true`,
        { method: 'GET' }
      );

      if (!response.ok) throw new Error('Failed to generate image');

      const blob = await response.blob();
      const fileName = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const publicUrl = await uploadToStorage(blob, fileName);

      setPreviewUrl(publicUrl);
      onPhotoUpdate(publicUrl);
      setUploadMode('select');

    } catch (error) {
      console.error('Error generating AI photo:', error);
      alert('Failed to generate photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAnonymousIcon = async () => {
    setIsProcessing(true);

    try {
      const iconStyles = [
        'minimalist geometric hash runner icon, bright lime green and hot pink colors, simple shapes, modern design',
        'abstract trail running symbol, neon colors, dynamic motion lines, signature brand style',
        'stylized footprint icon with On-On arrow, vibrant gradient, playful design',
        'geometric hash symbol with running figure silhouette, bold colors, clean design',
        'abstract runner avatar icon, colorful geometric shapes, energetic vibe'
      ];

      const randomStyle = iconStyles[Math.floor(Math.random() * iconStyles.length)];
      const prompt = `${randomStyle}, centered composition, black background, vector art style, no text`;

      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&enhance=true&nologo=true`,
        { method: 'GET' }
      );

      if (!response.ok) throw new Error('Failed to generate icon');

      const blob = await response.blob();
      const fileName = `anon-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const publicUrl = await uploadToStorage(blob, fileName);

      setPreviewUrl(publicUrl);
      onPhotoUpdate(publicUrl);
      setUploadMode('select');

    } catch (error) {
      console.error('Error generating anonymous icon:', error);
      alert('Failed to generate icon. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    onPhotoUpdate('');
    setUploadedPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleAccessory = (accessory: string) => {
    setSelectedAccessories(prev =>
      prev.includes(accessory)
        ? prev.filter(a => a !== accessory)
        : [...prev, accessory]
    );
  };

  const handleRegenerate = () => {
    if (uploadedPhotoUrl) {
      applyHashLookToPhoto(uploadedPhotoUrl);
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
                alt="Hash avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            {uploadedPhotoUrl && (
              <button
                onClick={() => setUploadMode('customize')}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#CCFF00] text-[#1C1C1E] rounded-lg font-semibold hover:bg-[#CCFF00]/90 transition-all flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Customize
              </button>
            )}
          </div>
        ) : (
          <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-[#3A3A3C] bg-[#1C1C1E] flex items-center justify-center">
            <div className="text-center p-8">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No photo yet</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setUploadMode('upload-tryon')}
            className="px-6 py-4 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all flex items-center justify-center gap-2"
          >
            <Shirt className="w-5 h-5" />
            AI Try-On: Upload & Get Hash Look
          </button>

          <button
            onClick={() => setUploadMode('ai-create')}
            className="px-6 py-4 bg-gradient-to-r from-[#B285FD] to-[#FF289B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#B285FD]/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create from Scratch
          </button>

          <button
            onClick={() => setUploadMode('anonymous')}
            className="px-6 py-4 bg-[#2C2C2E] text-[#E0E0E0] font-medium rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Generate Random Icon
          </button>
        </div>
      </div>
    );
  }

  if (uploadMode === 'upload-tryon') {
    return (
      <div className="space-y-4">
        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-[#3A3A3C]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#CCFF00]" />
            AI Try-On
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            Upload your photo and AI will automatically dress you in hash running gear with our signature colors!
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUploadForTryOn}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#CCFF00] file:text-[#1C1C1E] hover:file:bg-[#CCFF00]/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <p className="text-xs text-gray-400 mt-3">
            Maximum file size: 5MB. Best results with clear face photos.
          </p>

          {isProcessing && (
            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#E0E0E0]">Applying hash look to your photo...</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (uploadMode === 'customize') {
    return (
      <div className="space-y-4">
        {previewUrl && (
          <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-[#3A3A3C] bg-[#1C1C1E]">
            <img
              src={previewUrl}
              alt="Hash avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-[#3A3A3C] space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-[#E0E0E0] mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Shirt Color
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {HASH_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-lg ${color.bg} transition-all ${
                    selectedColor.value === color.value
                      ? 'ring-4 ring-white scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#E0E0E0] mb-3">Accessories</h4>
            <div className="grid grid-cols-2 gap-2">
              {ACCESSORIES.map((accessory) => (
                <button
                  key={accessory}
                  onClick={() => toggleAccessory(accessory)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedAccessories.includes(accessory)
                      ? 'bg-[#CCFF00] text-[#1C1C1E]'
                      : 'bg-[#2C2C2E] text-[#E0E0E0] border border-[#3A3A3C] hover:bg-[#3A3A3C]'
                  }`}
                >
                  {accessory}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#E0E0E0] mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Art Style
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedFilter.name === filter.name
                      ? 'bg-[#B285FD] text-white'
                      : 'bg-[#2C2C2E] text-[#E0E0E0] border border-[#3A3A3C] hover:bg-[#3A3A3C]'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isProcessing || !uploadedPhotoUrl}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-3 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Apply Changes
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Done
        </button>
      </div>
    );
  }

  if (uploadMode === 'ai-create') {
    const [aiPrompt, setAiPrompt] = useState('');

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
            Create from Scratch
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Choose a preset or describe your own
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setAiPrompt(suggestion.prompt)}
                    disabled={isProcessing}
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
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B285FD] focus:ring-2 focus:ring-[#B285FD]/20 transition-all resize-none disabled:opacity-50"
              />
            </div>

            <div className="bg-[#2C2C2E] rounded-lg p-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Tip: Choose a hash-themed preset or describe your own scene. Think action, celebration, trails, and the spirit of hashing.
              </p>
            </div>

            <button
              onClick={() => handleAICreateFromScratch(aiPrompt)}
              disabled={isProcessing || !aiPrompt.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#B285FD] to-[#FF289B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#B285FD]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (uploadMode === 'anonymous') {
    return (
      <div className="space-y-4">
        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-[#3A3A3C]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-[#CCFF00]" />
            Anonymous Mode
          </h3>

          <p className="text-sm text-gray-400 mb-6">
            Generate a unique random icon in our signature style. You can always replace it later with a personal photo.
          </p>

          <button
            onClick={generateAnonymousIcon}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#CCFF00] to-[#FF289B] text-[#1C1C1E] font-bold rounded-xl hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-3 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
                Generating Icon...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                Generate Random Icon
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setUploadMode('select')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-[#2C2C2E] text-[#E0E0E0] rounded-xl border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  return null;
}
