// client/src/components/setup-modal.tsx

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input'; // Assuming this provides the base Input styling
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast'; // Correct import for useToast

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (playerId: number, name: string, gender: string) => void;
  language: 'en' | 'ar';
}

// --- START: SVG Icon Components (Final Corrected Version) ---

// Male Gender Symbol SVG (based on your desired icon: ♂)
const MaleSymbolSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="30">
    <circle cx="256" cy="180" r="100" /> {/* Head */}
    <line x1="256" y1="280" x2="256" y2="480" /> {/* Body */}
    <line x1="156" y1="380" x2="356" y2="380" /> {/* Shoulders/Arms */}
  </svg>
);

// Female Gender Symbol SVG (based on your desired icon: ♀)
const FemaleSymbolSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="30">
    <circle cx="256" cy="180" r="100" /> {/* Head */}
    <line x1="256" y1="280" x2="256" y2="480" /> {/* Body */}
    <line x1="156" y1="380" x2="356" y2="380" /> {/* Base of Cross */}
    <line x1="256" y1="480" x2="256" y2="280" /> {/* Vertical line for cross */}
  </svg>
);

// Default Profile Icon SVG (used if no gender is selected yet or no custom photo)
const DefaultProfileIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="character-base">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
);

// --- END: SVG Icon Components ---

export function SetupModal({ isOpen, onComplete, language }: SetupModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const { toast } = useToast(); // useToast hook is correctly initialized here

  // Corrected texts object to match exact requirements
  const texts = {
    en: {
      welcome: "Welcome to MORAL CROSSROADS",
      subtitle: "Interactive Ethical Dilemmas",
      yourName: "Your Name:",
      enterName: "Enter your name",
      // Removed "Gender:" label from here as it's not needed in JSX
      male: "Male",
      female: "Female",
      profilePhoto: "Profile Photo", // Corrected
      addPhoto: "Add Photo",
      photoComingSoon: "Uploading photos is coming soon!",
      starting: "Starting...",
      startPlaying: "Start Playing"
    },
    ar: {
      welcome: "مرحباً بك في مفترق الأخلاق",
      subtitle: "معضلات أخلاقية تفاعلية",
      yourName: "اسمك:",
      enterName: "أدخل اسمك",
      // Removed "الجنس:" label from here
      male: "ذكر",
      female: "أنثى",
      profilePhoto: "صورة الملف", // Corrected
      addPhoto: "أضف صورة",
      photoComingSoon: "رفع الصور قريباً",
      starting: "جاري البدء...",
      startPlaying: "ابدأ اللعب"
    }
  };

  const handleProfilePhotoClick = () => {
    toast({
      title: texts[language].profilePhoto,
      description: texts[language].photoComingSoon,
      variant: "default",
    });
  };

  const createPlayerMutation = useMutation({
    mutationFn: async (playerData: { name: string; gender: string }) => {
      const response = await apiRequest('POST', '/api/players', playerData);
      return response.json();
    },
    onSuccess: (player) => {
      onComplete(player.id, player.name, player.gender);
    },
  });

  const handleSubmit = () => {
    if (name.trim() && gender) {
      createPlayerMutation.mutate({ name: name.trim(), gender });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Futuristic backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>
      <div className="starfield-bg opacity-50"></div>
      
      <div className="glass-panel p-10 max-w-lg w-full mx-4 relative z-10 rounded-[20px]">
        <div className="text-center mb-8">
          {/* Main Title - Uses gradient blue/purple */}
          <h2 className="text-4xl font-bold mb-3 neon-text gradient-blue">{texts[language].welcome}</h2>
          <p className="text-blue-300 text-lg font-roboto-medium">{texts[language].subtitle}</p>
        </div>
        
        <div className="space-y-6">
          {/* Name Input - Styled like the title bar */}
          <div>
            <Label htmlFor="playerName" className="block text-sm font-medium mb-3 text-purple-300 font-composition">
              {texts[language].yourName}
            </Label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={texts[language].enterName}
              // Styling to resemble the game's title bar/boxes, using common variables
              className="w-full p-4 border-2 rounded-lg bg-transparent text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
              style={{
                borderColor: 'hsl(var(--mc-blue))', // Blue border
                background: 'linear-gradient(45deg, hsla(var(--mc-blue), 0.1), hsla(var(--mc-purple), 0.1))', // Subtle gradient background
                boxShadow: '0 0 10px hsla(var(--mc-blue), 0.3)' // Subtle glow
              }}
            />
          </div>
          
          {/* Gender Selection - RESTORED BOXES, REMOVED HEADLINE, UPDATED SYMBOLS */}
          {/* REMOVED: Label for gender headline (texts[language].gender) */}
          <div className="grid grid-cols-2 gap-3"> {/* Use grid-cols-2 */}
            {['male', 'female'].map((genderOption) => ( // Only male and female options
              <button
                key={genderOption}
                onClick={() => setGender(genderOption)}
                // Styling to match old version's gender boxes (neutral gray background by default)
                className={`p-4 glass-panel rounded-lg flex flex-col items-center justify-center font-medium
                  ${gender === genderOption 
                    ? 'border-2 text-white selected' // Highlighted selected state
                    : 'border border-gray-500 text-gray-300 hover:text-white hover:border-blue-400'
                  }`}
                // Dynamic styling for selected state (green border/glow)
                style={gender === genderOption ? {
                  borderColor: 'hsl(var(--mc-green))', // Green border when selected
                  background: 'hsla(var(--mc-green), 0.2)', // Light green background when selected
                  boxShadow: '0 0 15px hsla(var(--mc-green), 0.5)' // Green glow when selected
                } : {}}
              >
                <div className="mb-2 w-10 h-10 flex items-center justify-center"> {/* Fixed size for icon container */}
                  {genderOption === 'male' ? <MaleSymbolSVG /> : <FemaleSymbolSVG />} {/* Used new Symbol SVGs */}
                </div>
                <div className="text-sm font-composition">
                  {genderOption === 'male' ? texts[language].male : texts[language].female}
                </div>
              </button>
            ))}
          </div>
          
          {/* Photo Upload Area - FIXED SIZE & CENTERING, ALIGNED WITH GENDER BOXES */}
          <div
            onClick={handleProfilePhotoClick}
            className="glass-panel p-4 border border-dashed rounded-lg text-center cursor-pointer relative group
                       w-full max-w-xs mx-auto flex flex-col items-center justify-center" // w-full max-w-xs to make it similar width to gender buttons
            style={{ 
                borderColor: 'hsla(var(--mc-white), 0.4)',
                minHeight: '130px' // min-height similar to gender buttons
            }}
          >
            <div className="text-gray-400 text-sm mb-2 font-composition">
              {texts[language].profilePhoto}
            </div>
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center relative overflow-hidden">
              {/* Character SVG based on selected gender or default icon */}
              {gender === 'male' ? <MaleSymbolSVG /> : // Used gender symbols for default profile display
               gender === 'female' ? <FemaleSymbolSVG /> :
               <DefaultProfileIcon />} {/* DefaultProfileIcon for initial state or if gender not chosen */}

              {/* Overlay for "Add Photo" on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <span className="text-white text-sm font-medium font-composition">{texts[language].addPhoto}</span>
              </div>
            </div>
          </div>
          
          {/* Start Button - RESTORED ORIGINAL STYLING & GLOW */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !gender || createPlayerMutation.isPending}
            className="w-full p-4 text-lg font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed fancy-button rounded-lg"
            // RESTORED: Styling for background, border, and boxShadow from previous perfect version
            style={{
              background: !name.trim() || !gender ? 'rgba(128, 128, 128, 0.3)' : 
                         'linear-gradient(45deg, hsl(var(--mc-green)), hsl(var(--mc-blue)))', // Uses mc-green and mc-blue for gradient
              borderColor: 'hsl(var(--mc-green))', // Uses mc-green for border
              boxShadow: !name.trim() || !gender ? 'none' : '0 0 30px hsla(var(--mc-green), 0.5)', // Uses mc-green for glow
            }}
          >
            {createPlayerMutation.isPending ? (
              <div className="flex items-center justify-center font-composition">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                {texts[language].starting}
              </div>
            ) : (
              <span className="font-composition">{texts[language].startPlaying}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}