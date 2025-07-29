"use client"

import { useState } from "react"
import { LazyImage } from "./LazyImage"
import { PhotoModal } from "./PhotoModal"
import { RetroButton } from "./RetroButton"

interface Photo {
  id: number
  cloudinary_url: string
  thumbnail_url: string
  caption?: string
  category: string
  upload_timestamp: string
  view_count: number
}

interface PhotoGalleryProps {
  photos: Photo[]
  loading: boolean
  onRefresh: () => void
}

export function PhotoGallery({ photos, loading, onRefresh }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const handlePhotoClick = async (photo: Photo) => {
    // Track view
    await fetch(`/api/photos/${photo.id}/view`, { method: "POST" })
    setSelectedPhoto(photo)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner"></div>
        <span className="ml-3 retro-font-primary">Loading photos...</span>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📷</div>
        <p className="retro-font-primary">No photos yet! Be the first to share.</p>
        <RetroButton onClick={onRefresh}>🔄 Refresh Gallery</RetroButton>
      </div>
    )
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => handlePhotoClick(photo)}>
            <LazyImage
              src={photo.thumbnail_url}
              alt={photo.caption || "Orientation photo"}
              className="photo-thumbnail"
            />
            <div className="photo-overlay">
              <div className="photo-info">
                <span className="view-count">👁️ {photo.view_count}</span>
                <span className="upload-date">{new Date(photo.upload_timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <RetroButton onClick={onRefresh}>🔄 Load More Photos</RetroButton>
      </div>

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </>
  )
}
