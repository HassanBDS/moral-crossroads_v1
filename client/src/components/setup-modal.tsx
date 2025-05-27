import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (playerId: number, name: string, gender: string) => void;
}

export function SetupModal({ isOpen, onComplete }: SetupModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 fancy-box max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to BORAQ RAILWAY</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Your Name:
            </Label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border-2 border-black"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Gender:</Label>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'non-binary'].map((genderOption) => (
                <Button
                  key={genderOption}
                  variant={gender === genderOption ? "default" : "outline"}
                  onClick={() => setGender(genderOption)}
                  className={`p-2 border-2 border-black hover:bg-gray-100 ${
                    gender === genderOption ? 'bg-boraq-green text-white' : ''
                  }`}
                >
                  {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !gender || createPlayerMutation.isPending}
            className="w-full p-3 bg-boraq-green text-white font-medium hover:bg-green-600 transition-colors"
          >
            {createPlayerMutation.isPending ? 'Starting...' : 'Start Playing'}
          </Button>
        </div>
      </div>
    </div>
  );
}
