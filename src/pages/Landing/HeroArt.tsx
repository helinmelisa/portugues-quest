// Stylised Lisbon street: tiled houses, a yellow tram and the sun.
export function HeroArt() {
  return (
    <svg viewBox="0 0 400 320" role="img" aria-label="Illustration of colourful Lisbon houses with a yellow tram" className="w-full">
      <defs>
        <pattern id="azulejo" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#FFFEFA" />
          <path d="M8 2 L14 8 L8 14 L2 8 Z" fill="none" stroke="#A9C4C4" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="1.6" fill="#A9C4C4" />
        </pattern>
      </defs>
      <circle cx="320" cy="70" r="34" fill="#E8C477" />
      <path d="M0 250 Q100 225 200 245 T400 240 V320 H0 Z" fill="#A9B79A" opacity="0.5" />

      <rect x="30" y="120" width="90" height="140" rx="6" fill="url(#azulejo)" stroke="#EAE7DC" />
      <path d="M24 124 L75 88 L126 124 Z" fill="#D78362" />
      <rect x="125" y="95" width="80" height="165" rx="6" fill="#E8C477" opacity="0.85" />
      <path d="M119 99 L165 65 L211 99 Z" fill="#D78362" />
      <rect x="210" y="135" width="85" height="125" rx="6" fill="#A9C4C4" />
      <path d="M204 139 L252 105 L301 139 Z" fill="#B8654A" />

      {[[50, 145], [85, 145], [50, 195], [85, 195], [145, 120], [175, 120], [145, 170], [175, 170], [230, 160], [262, 160], [230, 205], [262, 205]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="16" height="24" rx="8" fill="#34413A" opacity="0.75" />
      ))}

      <line x1="0" y1="232" x2="400" y2="232" stroke="#34413A" strokeWidth="1.5" opacity="0.4" />
      <g transform="translate(240 236)">
        <line x1="60" y1="-4" x2="70" y2="-24" stroke="#34413A" strokeWidth="2" />
        <rect x="0" y="0" width="130" height="50" rx="10" fill="#E8C477" stroke="#34413A" strokeWidth="2" />
        <rect x="0" y="34" width="130" height="16" rx="4" fill="#FFFEFA" opacity="0.8" />
        {[12, 42, 72, 102].map((x) => (
          <rect key={x} x={x} y="8" width="18" height="18" rx="4" fill="#A9C4C4" stroke="#34413A" strokeWidth="1.5" />
        ))}
        <text x="65" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#34413A">28</text>
        <circle cx="28" cy="54" r="7" fill="#34413A" />
        <circle cx="102" cy="54" r="7" fill="#34413A" />
      </g>
    </svg>
  )
}
