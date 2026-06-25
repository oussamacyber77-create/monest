export function SARIcon({ className = "w-4 h-4" }) {
  return (
    <span className={"inline-flex items-center justify-center font-medium " + className}
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      aria-label="ريال سعودي"
    >
      ر.س
    </span>
  )
}
