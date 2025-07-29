import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

// Initialize the Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cloudinary_public_id,
      cloudinary_url,
      thumbnail_url,
      filename,
      file_size,
      image_width,
      image_height,
      caption = "",
      category = "general",
    } = body

    // Get client info for analytics
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const ipHash = crypto.createHash("sha256").update(clientIP).digest("hex")
    const userAgentHash = crypto.createHash("sha256").update(userAgent).digest("hex")

    // Detect device type
    const deviceType = userAgent.toLowerCase().includes("mobile")
      ? "mobile"
      : userAgent.toLowerCase().includes("tablet")
        ? "tablet"
        : "desktop"

    // Insert photo record using tagged template literal
    const photoResult = await sql`
      INSERT INTO photos (
        filename,
        cloudinary_public_id,
        cloudinary_url,
        thumbnail_url,
        caption,
        category,
        uploader_ip_hash,
        user_agent_hash,
        device_type,
        file_size,
        image_width,
        image_height,
        moderation_status
      ) VALUES (
        ${filename},
        ${cloudinary_public_id},
        ${cloudinary_url},
        ${thumbnail_url},
        ${caption},
        ${category},
        ${ipHash},
        ${userAgentHash},
        ${deviceType},
        ${file_size},
        ${image_width},
        ${image_height},
        'approved'
      )
      RETURNING *
    `

    const newPhoto = photoResult[0]

    // Track upload event using tagged template literal
    await sql`
      INSERT INTO analytics (
        event_type,
        photo_id,
        device_type,
        ip_hash,
        user_agent_hash
      ) VALUES (
        'photo_upload_success',
        ${newPhoto.id},
        ${deviceType},
        ${ipHash},
        ${userAgentHash}
      )
    `

    return NextResponse.json({
      success: true,
      photo: newPhoto,
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}
