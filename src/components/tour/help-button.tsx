"use client"

interface HelpButtonProps {
  onClick: () => void
}

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 start-6 z-40 w-10 h-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
      aria-label="Help"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#F2F2F2] dark:text-[#0D0D0D]">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </button>
  )
}
