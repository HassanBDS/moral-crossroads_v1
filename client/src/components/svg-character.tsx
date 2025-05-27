interface SvgCharacterProps {
  x: number;
  y: number;
  sleeping?: boolean;
  splatted?: boolean;
  className?: string;
}

export function SvgCharacter({ x, y, sleeping = false, splatted = false, className = "" }: SvgCharacterProps) {
  return (
    <g transform={`translate(${x}, ${y})`} className={className}>
      {/* Head */}
      <circle cx="0" cy="0" r="12" className="mummy-character" />
      
      {/* Face */}
      {sleeping ? (
        <>
          <path d="M -5 -3 C -5 -3 -2 -6 2 -3" className="mummy-character" />
          <path d="M -5 1 C -5 1 -2 -2 2 1" className="mummy-character" />
        </>
      ) : (
        <>
          <circle cx="-4" cy="-3" r="2" fill="#000" />
          <circle cx="4" cy="-3" r="2" fill="#000" />
          <path d="M -3 3 Q 0 6 3 3" className="mummy-character" />
        </>
      )}
      
      {/* Body */}
      <line x1="0" y1="12" x2="0" y2="40" className="mummy-character" />
      
      {/* Arms */}
      <line x1="0" y1="20" x2="-15" y2="35" className="mummy-character" />
      <line x1="0" y1="20" x2="15" y2="35" className="mummy-character" />
      
      {/* Legs */}
      <line x1="0" y1="40" x2="-10" y2="55" className="mummy-character" />
      <line x1="0" y1="40" x2="10" y2="55" className="mummy-character" />
      
      {/* Mummy stripes */}
      <path d="M -10 15 L 10 15" className="mummy-character" />
      <path d="M -10 25 L 10 25" className="mummy-character" />
      
      {/* Sleep indicators */}
      {sleeping && (
        <>
          <text x="20" y="-10" fontFamily="Inter" fontSize="12" fontWeight="bold">Z</text>
          {Math.random() > 0.5 && (
            <>
              <text x="15" y="-5" fontFamily="Inter" fontSize="10" fontWeight="bold">Z</text>
              <text x="25" y="-15" fontFamily="Inter" fontSize="14" fontWeight="bold">Z</text>
            </>
          )}
        </>
      )}
      
      {/* Splat effect */}
      {splatted && (
        <g className="splat-effect">
          <circle cx="0" cy="0" r="20" fill="#EF4444" opacity="0.7" />
          <text x="0" y="5" textAnchor="middle" fontFamily="Inter" fontSize="16" fontWeight="bold" fill="white">
            SPLAT
          </text>
        </g>
      )}
    </g>
  );
}
