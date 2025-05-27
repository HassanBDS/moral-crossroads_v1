interface TrolleySvgProps {
  x?: number;
  y?: number;
  className?: string;
}

export function TrolleySvg({ x = 80, y = 170, className = "" }: TrolleySvgProps) {
  return (
    <g transform={`translate(${x}, ${y})`} className={className}>
      {/* Main trolley body */}
      <rect x="0" y="0" width="80" height="40" stroke="#000" strokeWidth="3" fill="#FFF" rx="5" />
      
      {/* Windows */}
      <rect x="5" y="5" width="15" height="15" stroke="#000" strokeWidth="2" fill="none" />
      <rect x="25" y="5" width="15" height="15" stroke="#000" strokeWidth="2" fill="none" />
      <rect x="45" y="5" width="15" height="15" stroke="#000" strokeWidth="2" fill="none" />
      
      {/* Door */}
      <rect x="65" y="5" width="10" height="30" stroke="#000" strokeWidth="2" fill="none" />
      
      {/* Wheels */}
      <circle cx="15" cy="45" r="8" stroke="#000" strokeWidth="3" fill="#333" />
      <circle cx="65" cy="45" r="8" stroke="#000" strokeWidth="3" fill="#333" />
      
      {/* BORAQ text */}
      <text x="40" y="25" fontFamily="Inter" fontSize="8" fontWeight="bold" textAnchor="middle">
        BORAQ
      </text>
      
      {/* Front details */}
      <rect x="75" y="15" width="3" height="10" fill="#000" />
    </g>
  );
}
