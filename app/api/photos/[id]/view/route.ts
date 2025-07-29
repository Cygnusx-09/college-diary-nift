import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

// Initialize the Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const photoId = Number.parseInt(params.id)

    // Get client info
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const ipHash = crypto.createHash("sha256").update(clientIP).digest("hex")
    const userAgentHash = crypto.createHash("sha256").update(userAgent).digest("hex")
    const deviceType = userAgent.toLowerCase().includes("mobile")
      ? "mobile"
      : userAgent.toLowerCase().includes("tablet")
        ? "tablet"
        : "desktop"

    // Increment view count using tagged template literal
    await sql`
      UPDATE photos 
      SET view_count = view_count + 1 
      WHERE id = ${photoId}
    `

    // Track view event using tagged template literal
    await sql`
      INSERT INTO analytics (
        event_type,
        photo_id,
        device_type,
        ip_hash,
        user_agent_hash
      ) VALUES (
        'photo_view',
        ${photoId},
        ${deviceType},
        ${ipHash},
        ${userAgentHash}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking photo view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
