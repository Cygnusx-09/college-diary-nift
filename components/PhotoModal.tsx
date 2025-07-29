"use client"

import { useEffect } from "react"
import { RetroButton } from "./RetroButton"

interface Photo {
  id: number
  cloudinary_url: string
  caption?: string
  upload_timestamp: string
  view_count: number
}

interface PhotoModalProps {
  photo: Photo
  onClose: () => void
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  return (
    <div className="photo-modal-overlay" onClick={onClose}>
      <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📷 Photo Viewer</span>
          <RetroButton onClick={onClose} size="small">
            ✕ Close
          </RetroButton>
        </div>

        <div className="modal-content">
          <img
            src={photo.cloudinary_url || "/placeholder.svg"}
            alt={photo.caption || "Orientation photo"}
            className="modal-image"
          />

          <div className="modal-info">
            {photo.caption && <p className="photo-caption">{photo.caption}</p>}
            <div className="photo-meta">
              <span>👁️ {photo.view_count} views</span>
              <span>📅 {new Date(photo.upload_timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
