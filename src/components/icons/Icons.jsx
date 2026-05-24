/**
 * Icons.jsx
 *
 * Biblioteca de ícones SVG inline do SoundWave.
 * Usar ícones inline evita dependência de pacote e permite
 * controle total sobre stroke, fill e tamanho.
 *
 * Todos os ícones aceitam:
 *  - size     : número (px) — padrão 24
 *  - className: classes Tailwind adicionais
 *  - ...rest  : demais props HTML (aria-label, onClick, etc.)
 */

const defaultProps = { size: 24, className: "" };

// Componente base para evitar repetição
function Svg({ size, className, children, fill = "none", viewBox = "0 0 24 24", ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

export function SearchIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  );
}

export function LibraryIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 19V5" />
      <path d="M8 19V9" />
      <rect x="12" y="5" width="8" height="14" rx="1" />
    </Svg>
  );
}

export function PlusIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function HeartIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

export function PlayIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className} fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
  );
}

export function PauseIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className} fill="currentColor" stroke="none">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </Svg>
  );
}

export function SkipNextIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className} fill="currentColor" stroke="none">
      <polygon points="5 4 15 12 5 20 5 4" />
      <rect x="19" y="5" width="2" height="14" />
    </Svg>
  );
}

export function SkipPrevIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className} fill="currentColor" stroke="none">
      <polygon points="19 20 9 12 19 4 19 20" />
      <rect x="3" y="5" width="2" height="14" />
    </Svg>
  );
}

export function ShuffleIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </Svg>
  );
}

export function RepeatIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Svg>
  );
}

export function RepeatOneIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="10" y1="10" x2="12" y2="8" />
    </Svg>
  );
}

export function VolumeIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </Svg>
  );
}

export function VolumeMuteIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </Svg>
  );
}

export function DotsIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className} fill="currentColor" stroke="none">
      <circle cx="12" cy="5"  r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="12" cy="19" r="1.2" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 24, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}
