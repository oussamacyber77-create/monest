"use client"

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
}

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={"w-12 h-7 relative transition-colors shrink-0 " + (checked ? "bg-[#0070F3]" : "bg-[#D4D4D4] dark:bg-[#333333]")}
    >
      <span className={"absolute top-0.5 w-6 h-6 bg-white transition-all " + (checked ? "end-0.5" : "start-0.5")} />
    </button>
  )
}
