// Generate a consistent color from a name string
const AVATAR_COLORS = [
  "#5865F2", "#ED4245", "#57F287", "#FEE75C", "#EB459E",
  "#FF73FA", "#00E5FF", "#FFC83F", "#25D366", "#7C3AED",
  "#F97316", "#06B6D4", "#8B5CF6", "#EC4899", "#14B8A6",
]

export function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Get first letter for avatar (Arabic or English)
export function getAvatarLetter(name: string): string {
  const clean = name.trim()
  return clean.charAt(0)
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return "الآن"
  if (mins < 60) return `منذ ${mins} د`
  if (hours < 24) return `منذ ${hours} س`
  if (days < 7) return `منذ ${days} ي`
  return date.toLocaleDateString("en-CA")
}
