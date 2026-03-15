import { BookPage } from '../types';

interface BookIllustrationProps {
  page: BookPage;
  themeId: string;
}

const getThemeColors = (themeId: string) => {
  const themes: Record<string, { from: string; to: string; accent: string }> = {
    'ocean-adventure': { from: '#3b82f6', to: '#06b6d4', accent: '#f59e0b' },
    'animal-city': { from: '#10b981', to: '#84cc16', accent: '#f97316' },
    'ice-kingdom': { from: '#60a5fa', to: '#a5b4fc', accent: '#e0e7ff' },
    'tower-adventure': { from: '#f59e0b', to: '#dc2626', accent: '#fbbf24' },
    'lantern-quest': { from: '#fbbf24', to: '#f59e0b', accent: '#fde047' }
  };

  return themes[themeId] || themes['ocean-adventure'];
};

const getThemeIcon = (themeId: string, altText: string) => {
  const lowerAlt = altText.toLowerCase();

  if (themeId === 'ocean-adventure') {
    if (lowerAlt.includes('fish')) {
      return (
        <g>
          <ellipse cx="200" cy="150" rx="60" ry="35" fill="#f97316" opacity="0.9"/>
          <circle cx="230" cy="140" r="8" fill="#1f2937"/>
          <path d="M 140 150 L 120 130 L 120 170 Z" fill="#f97316" opacity="0.8"/>
          <ellipse cx="185" cy="145" rx="8" ry="12" fill="#fbbf24" opacity="0.6"/>
        </g>
      );
    }
    return (
      <g>
        <circle cx="200" cy="160" r="50" fill="#06b6d4" opacity="0.3"/>
        <circle cx="220" cy="140" r="30" fill="#06b6d4" opacity="0.4"/>
        <circle cx="180" cy="180" r="35" fill="#3b82f6" opacity="0.3"/>
      </g>
    );
  }

  if (themeId === 'animal-city') {
    if (lowerAlt.includes('bunny') || lowerAlt.includes('bea')) {
      return (
        <g>
          <ellipse cx="200" cy="180" rx="45" ry="55" fill="#f3f4f6"/>
          <circle cx="200" cy="130" r="35" fill="#f3f4f6"/>
          <ellipse cx="180" cy="100" rx="12" ry="30" fill="#f3f4f6"/>
          <ellipse cx="220" cy="100" rx="12" ry="30" fill="#f3f4f6"/>
          <circle cx="190" cy="125" r="4" fill="#1f2937"/>
          <circle cx="210" cy="125" r="4" fill="#1f2937"/>
          <ellipse cx="200" cy="135" rx="4" ry="6" fill="#f472b6"/>
        </g>
      );
    }
    return (
      <g>
        <rect x="120" y="200" width="60" height="80" rx="5" fill="#dc2626" opacity="0.7"/>
        <rect x="200" y="180" width="70" height="100" rx="5" fill="#f59e0b" opacity="0.7"/>
        <rect x="290" y="190" width="50" height="90" rx="5" fill="#3b82f6" opacity="0.7"/>
      </g>
    );
  }

  if (themeId === 'ice-kingdom') {
    if (lowerAlt.includes('penguin') || lowerAlt.includes('pip')) {
      return (
        <g>
          <ellipse cx="200" cy="180" rx="40" ry="50" fill="#1f2937"/>
          <ellipse cx="200" cy="180" rx="25" ry="40" fill="#f3f4f6"/>
          <circle cx="200" cy="140" r="28" fill="#1f2937"/>
          <circle cx="193" cy="135" r="4" fill="#f3f4f6"/>
          <circle cx="207" cy="135" r="4" fill="#f3f4f6"/>
          <path d="M 200 145 L 205 150 L 195 150 Z" fill="#f97316"/>
        </g>
      );
    }
    return (
      <g>
        <polygon points="200,80 250,200 150,200" fill="#e0e7ff" opacity="0.6"/>
        <polygon points="210,100 240,180 180,180" fill="#c7d2fe" opacity="0.7"/>
        <circle cx="170" cy="190" r="15" fill="#dbeafe" opacity="0.8"/>
        <circle cx="230" cy="195" r="12" fill="#dbeafe" opacity="0.8"/>
      </g>
    );
  }

  if (themeId === 'tower-adventure') {
    if (lowerAlt.includes('mouse') || lowerAlt.includes('lily')) {
      return (
        <g>
          <ellipse cx="200" cy="190" rx="30" ry="35" fill="#9ca3af"/>
          <circle cx="200" cy="160" r="25" fill="#9ca3af"/>
          <circle cx="180" cy="150" r="15" fill="#9ca3af"/>
          <circle cx="220" cy="150" r="15" fill="#9ca3af"/>
          <circle cx="193" cy="157" r="3" fill="#1f2937"/>
          <circle cx="207" cy="157" r="3" fill="#1f2937"/>
          <ellipse cx="200" cy="200" rx="35" ry="15" fill="#d1d5db" opacity="0.6"/>
        </g>
      );
    }
    return (
      <g>
        <rect x="160" y="100" width="80" height="180" rx="8" fill="#78716c" opacity="0.7"/>
        <rect x="175" y="130" width="20" height="30" rx="3" fill="#fbbf24" opacity="0.5"/>
        <rect x="205" y="160" width="20" height="30" rx="3" fill="#fbbf24" opacity="0.5"/>
        <rect x="175" y="200" width="20" height="30" rx="3" fill="#fbbf24" opacity="0.5"/>
      </g>
    );
  }

  if (themeId === 'lantern-quest') {
    if (lowerAlt.includes('firefly') || lowerAlt.includes('luna')) {
      return (
        <g>
          <ellipse cx="200" cy="160" rx="20" ry="25" fill="#422006"/>
          <ellipse cx="185" cy="155" rx="15" ry="5" fill="#422006" opacity="0.3" transform="rotate(-30 185 155)"/>
          <ellipse cx="215" cy="155" rx="15" ry="5" fill="#422006" opacity="0.3" transform="rotate(30 215 155)"/>
          <circle cx="200" cy="180" r="25" fill="#fef08a" opacity="0.6"/>
          <circle cx="200" cy="180" r="18" fill="#fde047" opacity="0.8"/>
          <circle cx="200" cy="180" r="12" fill="#facc15"/>
        </g>
      );
    }
    return (
      <g>
        <rect x="190" y="120" width="20" height="80" rx="2" fill="#78716c" opacity="0.5"/>
        <path d="M 200 100 L 220 120 L 200 115 L 180 120 Z" fill="#f59e0b" opacity="0.7"/>
        <rect x="185" y="105" width="30" height="40" rx="4" fill="#fbbf24" opacity="0.4"/>
        <circle cx="200" cy="125" r="15" fill="#fde047" opacity="0.7"/>
      </g>
    );
  }

  return null;
};

export const BookIllustration = ({ page, themeId }: BookIllustrationProps) => {
  const colors = getThemeColors(themeId);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br p-8"
         style={{
           background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`
         }}>
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <defs>
          <radialGradient id={`glow-${themeId}`}>
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0"/>
          </radialGradient>
        </defs>

        <circle cx="200" cy="150" r="120" fill={`url(#glow-${themeId})`}/>

        {getThemeIcon(themeId, page.altText)}

        <text
          x="200"
          y="270"
          textAnchor="middle"
          fill="#1f2937"
          fontSize="14"
          fontWeight="600"
          opacity="0.7"
        >
          {page.altText}
        </text>
      </svg>
    </div>
  );
};
