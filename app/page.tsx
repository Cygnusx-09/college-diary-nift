"use client"

import { useState, useEffect, useCallback } from "react" // Added useCallback
import { WindowFrame } from "@/components/WindowFrame"
import { PhotoUpload } from "@/components/PhotoUpload"
import { PhotoGallery } from "@/components/PhotoGallery"
import { CategoryFilter } from "@/components/CategoryFilter"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  const [photos, setPhotos] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  // Wrap fetchPhotos in useCallback to prevent unnecessary re-creations
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/photos?category=${selectedCategory}&limit=20`)
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error("Error fetching photos:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory]) // Dependency on selectedCategory

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos]) // Dependency on fetchPhotos (which is memoized by useCallback)

  // MODIFIED: Instead of directly adding to state, trigger a re-fetch
  const handlePhotoUpload = async () => {
    // After a successful upload, re-fetch all photos to ensure consistency
    // This prevents duplicate entries in the client-side state
    await fetchPhotos()
  }

  return (
    <div className="min-h-screen bg-desktop-teal">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <WindowFrame title="College Diary - NIFT Jodhpur Orientation 2025">
          <div className="text-center space-y-4">
            <h1 className="retro-font-display text-2xl md:text-3xl">📸 Share Your Orientation Memories! 📸</h1>
            <p className="retro-font-primary text-sm md:text-base">
              Upload and view photos from NIFT Jodhpur's orientation week. No registration required - just drag, drop,
              and share!
            </p>
          </div>
        </WindowFrame>

        {/* Photo Upload Section */}
        <WindowFrame title="📤 Upload Photos" className="upload-section">
          {/* Pass handlePhotoUpload without arguments, as it now just triggers a re-fetch */}
          <PhotoUpload onUpload={handlePhotoUpload} />
        </WindowFrame>

        {/* Category Filter */}
        <WindowFrame title="🗂️ Browse by Category">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </WindowFrame>

        {/* Photo Gallery */}
        <WindowFrame title="📷 Orientation Gallery" className="gallery-section">
          <PhotoGallery photos={photos} loading={loading} onRefresh={fetchPhotos} />
        </WindowFrame>
      </main>

      <Footer />
    </div>
  )
}
