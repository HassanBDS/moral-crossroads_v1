interface UserProfileProps {
  playerName: string;
  playerGender: string;
  language: 'en' | 'ar';
}

export function UserProfile({ playerName, playerGender, language }: UserProfileProps) {
  const texts = {
    en: {
      profile: "Your Character",
      name: "Name",
      gender: "Gender"
    },
    ar: {
      profile: "شخصيتك",
      name: "الاسم",
      gender: "الجنس"
    }
  };

  const renderCharacterAvatar = () => {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" className="mx-auto">
        {/* Head */}
        <circle cx="50" cy="30" r="20" stroke="#000" strokeWidth="3" fill="#fff" />
        
        {/* Face */}
        <circle cx="42" cy="25" r="3" fill="#000" />
        <circle cx="58" cy="25" r="3" fill="#000" />
        <path d="M 42 35 Q 50 40 58 35" stroke="#000" strokeWidth="2" fill="none" />
        
        {/* Body */}
        <rect x="35" y="45" width="30" height="40" stroke="#000" strokeWidth="3" fill="#fff" rx="5" />
        
        {/* Arms */}
        <line x1="35" y1="55" x2="20" y2="70" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <line x1="65" y1="55" x2="80" y2="70" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        
        {/* Legs */}
        <line x1="42" y1="85" x2="42" y2="110" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <line x1="58" y1="85" x2="58" y2="110" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        
        {/* Mummy stripes */}
        <line x1="35" y1="55" x2="65" y2="55" stroke="#000" strokeWidth="2" />
        <line x1="35" y1="65" x2="65" y2="65" stroke="#000" strokeWidth="2" />
        <line x1="35" y1="75" x2="65" y2="75" stroke="#000" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="fancy-box bg-yellow-300 p-4 h-32 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-2">
          {renderCharacterAvatar()}
        </div>
        <div className="text-sm font-medium">
          <div>{texts[language].name}: {playerName}</div>
          <div>{texts[language].gender}: {playerGender}</div>
        </div>
      </div>
    </div>
  );
}