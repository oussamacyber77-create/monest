export function getLiveKitUrl(): string {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_LIVEKIT_URL must be set")
  }
  return url
}
