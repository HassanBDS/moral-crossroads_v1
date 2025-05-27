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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white p-8 neal-box max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{texts[language].welcome}</h2>
          <p className="text-gray-600">{texts[language].subtitle}</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playerName" className="block text-sm font-medium mb-2">
              {texts[language].yourName}
            </Label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={texts[language].enterName}
              className="w-full p-3 border-2 border-black"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">{texts[language].gender}</Label>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'non-binary'].map((genderOption) => (
                <Button
                  key={genderOption}
                  variant={gender === genderOption ? "default" : "outline"}
                  onClick={() => setGender(genderOption)}
                  className={`p-2 border-2 border-black hover:bg-gray-100 transition-colors ${
                    gender === genderOption ? 'bg-green-500 text-white' : ''
                  }`}
                >
                  {genderOption === 'male' ? texts[language].male : 
                   genderOption === 'female' ? texts[language].female : 
                   texts[language].nonBinary}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !gender || createPlayerMutation.isPending}
            className="w-full p-3 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors border-2 border-black"
          >
            {createPlayerMutation.isPending ? texts[language].starting : texts[language].startPlaying}
          </Button>
        </div>
      </div>
    </div>
  );
}
