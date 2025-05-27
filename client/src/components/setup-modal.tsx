import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (playerId: number, name: string, gender: string) => void;
  language: 'en' | 'ar';
}

export function SetupModal({ isOpen, onComplete, language }: SetupModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const texts = {
    en: {
      welcome: "Welcome to MORAL CROSSROADS",
      subtitle: "Interactive Ethical Dilemmas",
      yourName: "Your Name:",
      enterName: "Enter your name",
      gender: "Gender:",
      male: "Male",
      female: "Female",
      nonBinary: "Non-Binary",
      starting: "Starting...",
      startPlaying: "Start Playing"
    },
    ar: {
      welcome: "مرحباً بك في مفترق الأخلاق",
      subtitle: "معضلات أخلاقية تفاعلية",
      yourName: "اسمك:",
      enterName: "أدخل اسمك",
      gender: "الجنس:",
      male: "ذكر",
      female: "أنثى",
      nonBinary: "غير محدد",
      starting: "جاري البدء...",
      startPlaying: "ابدأ اللعب"
    }
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
      
      <div className="glass-panel p-10 max-w-lg w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3 neon-text">{texts[language].welcome}</h2>
          <p className="text-blue-300 text-lg">{texts[language].subtitle}</p>
        </div>
        
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <Label htmlFor="playerName" className="block text-sm font-medium mb-3 text-purple-300">
              {texts[language].yourName}
            </Label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={texts[language].enterName}
              className="w-full p-4 glass-panel border border-blue-400 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>
          
          {/* Gender Selection */}
          <div>
            <Label className="block text-sm font-medium mb-3 text-purple-300">
              {texts[language].gender}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {['male', 'female', 'non-binary'].map((genderOption) => (
                <button
                  key={genderOption}
                  onClick={() => setGender(genderOption)}
                  className={`p-4 glass-panel transition-all duration-300 font-medium ${
                    gender === genderOption 
                      ? 'border-2 text-white' 
                      : 'border border-gray-500 text-gray-300 hover:text-white hover:border-blue-400'
                  }`}
                  style={gender === genderOption ? {
                    borderColor: 'var(--neon-green)',
                    background: 'rgba(0, 255, 136, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
                  } : {}}
                >
                  {/* Default Avatar Icons */}
                  <div className="mb-2">
                    {genderOption === 'male' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" className="mx-auto character-enhanced">
                        <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                        <rect x="12" y="16" width="8" height="12" stroke="currentColor" strokeWidth="2" fill="none" rx="1" />
                        <line x1="12" y1="20" x2="6" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20" y1="20" x2="26" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {genderOption === 'female' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" className="mx-auto character-enhanced">
                        <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 12 16 L 12 24 L 20 24 L 20 16" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="12" y1="20" x2="6" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20" y1="20" x2="26" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {genderOption === 'non-binary' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" className="mx-auto character-enhanced">
                        <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                        <polygon points="12,16 16,22 20,16" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="12" y1="20" x2="6" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20" y1="20" x2="26" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="text-sm">
                    {genderOption === 'male' ? texts[language].male : 
                     genderOption === 'female' ? texts[language].female : 
                     texts[language].nonBinary}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Photo Upload Area (Future Feature) */}
          <div className="glass-panel p-4 border border-dashed border-gray-500 text-center">
            <div className="text-gray-400 text-sm mb-2">
              {language === 'ar' ? 'صورة شخصية (قريباً)' : 'Profile Photo (Coming Soon)'}
            </div>
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
          </div>
          
          {/* Start Button */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !gender || createPlayerMutation.isPending}
            className="w-full p-4 text-lg font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: !name.trim() || !gender ? 'rgba(128, 128, 128, 0.3)' : 
                         'linear-gradient(45deg, var(--neon-green), var(--neon-blue))',
              border: '2px solid var(--neon-green)',
              borderRadius: '15px',
              boxShadow: !name.trim() || !gender ? 'none' : '0 0 30px rgba(0, 255, 136, 0.5)'
            }}
          >
            {createPlayerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                {texts[language].starting}
              </div>
            ) : (
              texts[language].startPlaying
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
