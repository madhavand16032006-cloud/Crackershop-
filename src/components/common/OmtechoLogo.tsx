import React from 'react';

interface OmtechoLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const OmtechoLogo: React.FC<OmtechoLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'responsive',
  showSubtitle = true,
  subtitleText = 'Sivakasi Fireworks'
}) => {
  // Dimensions mapping
  const heightMap = {
    sm: { icon: 22, text: 'text-sm', sub: 'text-[8px]' },
    responsive: { icon: 26, text: 'text-base sm:text-xl', sub: 'text-[9px] sm:text-[11px]' },
    md: { icon: 30, text: 'text-lg sm:text-xl', sub: 'text-[10px] sm:text-[11px]' },
    lg: { icon: 40, text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { icon: 52, text: 'text-2xl sm:text-3xl', sub: 'text-sm' }
  };

  const currentSize = heightMap[size] || heightMap.responsive;

  // SVG for the interlocking Yellow & Green Rings with Red Diagonal Arrow
  const IconSvg = ({ height = currentSize.icon }: { height?: number }) => {
    // Aspect ratio of the symbol is roughly 120 x 70
    const width = Math.round((height * 120) / 70);

    return (
      <svg
        viewBox="0 0 130 80"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible select-none drop-shadow-sm"
      >
        <defs>
          {/* Yellow Ring Gradient */}
          <linearGradient id="omtechoYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Green Ring Gradient */}
          <linearGradient id="omtechoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Red Arrow Gradient */}
          <linearGradient id="omtechoRed" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Yellow Circle (Left Ring) */}
        <circle
          cx="38"
          cy="42"
          r="24"
          stroke="url(#omtechoYellow)"
          strokeWidth="7.5"
          fill="none"
        />

        {/* Green Circle (Right Ring - Interlocking) */}
        <circle
          cx="68"
          cy="42"
          r="24"
          stroke="url(#omtechoGreen)"
          strokeWidth="7.5"
          fill="none"
        />

        {/* Red Diagonal Arrow Passing Upwards Through Interlocking Rings */}
        <g>
          {/* Arrow Shaft */}
          <line
            x1="36"
            y1="58"
            x2="80"
            y2="15"
            stroke="url(#omtechoRed)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Arrow Head */}
          <polygon
            points="73,10 93,12 85,32 79,25"
            fill="url(#omtechoRed)"
          />
        </g>
      </svg>
    );
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <IconSvg />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Visual Logo Symbol */}
      <IconSvg />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center select-none min-w-0">
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight ${currentSize.text} leading-none text-[#2563eb] dark:text-[#3b82f6] truncate`}
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.025em'
            }}
          >
            omtecho
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-bold tracking-wider uppercase ${currentSize.sub} leading-tight text-amber-400 mt-0.5 flex items-center gap-1 truncate`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
