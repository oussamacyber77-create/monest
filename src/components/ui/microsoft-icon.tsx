interface IconProps {
  size?: number
}

export function MicrosoftIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="18" height="18" rx="1" fill="#F25022"/>
      <rect x="26" y="4" width="18" height="18" rx="1" fill="#7FBA00"/>
      <rect x="4" y="26" width="18" height="18" rx="1" fill="#00A4EF"/>
      <rect x="26" y="26" width="18" height="18" rx="1" fill="#FFB900"/>
    </svg>
  )
}
