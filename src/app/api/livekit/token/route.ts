import { NextRequest, NextResponse } from "next/server"
import { createLiveKitToken } from "@/lib/livekit-server"

export async function POST(req: NextRequest) {
  try {
    const { room, identity, name } = await req.json()

    if (!room || !identity) {
      return NextResponse.json(
        { error: "room and identity are required" },
        { status: 400 }
      )
    }

    const token = await createLiveKitToken(room, identity, name || "User")
    return NextResponse.json({ token })
  } catch (err) {
    console.error("Token generation error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate token" },
      { status: 500 }
    )
  }
}
