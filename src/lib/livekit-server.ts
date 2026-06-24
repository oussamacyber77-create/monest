import { AccessToken } from "livekit-server-sdk"

export async function createLiveKitToken(room: string, identity: string, name: string): Promise<string> {
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set")
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    name,
    ttl: "1h",
  })

  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true })

  return await at.toJwt()
}
