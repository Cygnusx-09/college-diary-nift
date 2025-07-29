import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Initialize the Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50)
    const category = searchParams.get("category") || "all"
    const sort = searchParams.get("sort") || "newest"

    const offset = (page - 1) * limit

    // Build and execute the main query using tagged template literals
    let photos
    if (category === "all") {
      if (sort === "popular") {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved'
          ORDER BY view_count DESC, upload_timestamp DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      } else if (sort === "oldest") {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved'
          ORDER BY upload_timestamp ASC
          LIMIT ${limit} OFFSET ${offset}
        `
      } else {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved'
          ORDER BY upload_timestamp DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      }
    } else {
      if (sort === "popular") {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved' AND category = ${category}
          ORDER BY view_count DESC, upload_timestamp DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      } else if (sort === "oldest") {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved' AND category = ${category}
          ORDER BY upload_timestamp ASC
          LIMIT ${limit} OFFSET ${offset}
        `
      } else {
        photos = await sql`
          SELECT
            id,
            cloudinary_url,
            thumbnail_url,
            caption,
            category,
            upload_timestamp,
            view_count,
            image_width,
            image_height
          FROM photos
          WHERE moderation_status = 'approved' AND category = ${category}
          ORDER BY upload_timestamp DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      }
    }

    // Build and execute the count query
    let countResult
    if (category === "all") {
      countResult = await sql`
        SELECT COUNT(*) as total 
        FROM photos 
        WHERE moderation_status = 'approved'
      `
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total 
        FROM photos 
        WHERE moderation_status = 'approved' AND category = ${category}
      `
    }

    const totalPhotos = Number.parseInt(countResult[0].total)
    const totalPages = Math.ceil(totalPhotos / limit)

    return NextResponse.json({
      photos,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_photos: totalPhotos,
      },
    })
  } catch (error) {
    console.error("Error fetching photos:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
