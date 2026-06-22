type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: { box: 28, rx: 7, strokeWidth: 2, iconScale: 0.55, fontSize: 13 },
    md: { box: 36, rx: 9, strokeWidth: 2.5, iconScale: 0.7, fontSize: 16 },
    lg: { box: 48, rx: 12, strokeWidth: 3, iconScale: 0.92, fontSize: 20 },
  }

  const d = dimensions[size]
  const cx = d.box / 2
  const cy = d.box / 2
  const s = d.iconScale

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? '12px' : size === 'md' ? '10px' : '8px' }}>
      <svg
        width={d.box}
        height={d.box}
        viewBox={`0 0 ${d.box} ${d.box}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Fond vert */}
        <rect width={d.box} height={d.box} rx={d.rx} fill="#10B981" />

        {/* Icône lien */}
        <g
          stroke="#000"
          strokeWidth={d.strokeWidth}
          strokeLinecap="round"
          fill="none"
          transform={`translate(${cx}, ${cy}) scale(${s}) translate(-12, -12)`}
        >
          {/* Anneau du haut */}
          <path d="M5 12 L5 9 C5 6 7 4 10 4 L14 4 C17 4 19 6 19 9 L19 12" />
          {/* Anneau du bas */}
          <path d="M5 9 L5 12 C5 15 7 17 10 17 L14 17 C17 17 19 15 19 12 L19 9" />
          {/* Trait central */}
          <line x1="10" y1="10.5" x2="14" y2="10.5" strokeWidth={d.strokeWidth * 1.1} />
        </g>
      </svg>

      {showText && (
        <span style={{ fontSize: `${d.fontSize}px`, fontWeight: '700', color: '#fff', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          PayLink <span style={{ color: '#10B981' }}>Africa</span>
        </span>
      )}
    </div>
  )
}