"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { RetroButton } from "./RetroButton"
import { UploadProgress } from "./UploadProgress"

interface PhotoUploadProps {
  onUpload: (photo: any) => void
}

export function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        const maxSize = 1024
        const ratio = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            }
          },
          "image/jpeg",
          0.8,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "college_diary")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    return response.json()
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          setUploading(true)
          setUploadProgress(25)

          // Compress image
          const compressedFile = await compressImage(file)
          setUploadProgress(50)

          // Upload to Cloudinary
          const cloudinaryResult = await uploadToCloudinary(compressedFile)
          setUploadProgress(75)

          // Save to database
          const response = await fetch("/api/photos/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cloudinary_public_id: cloudinaryResult.public_id,
              cloudinary_url: cloudinaryResult.secure_url,
              thumbnail_url: cloudinaryResult.secure_url.replace("/upload/", "/upload/w_300,h_300,c_fill/"),
              filename: file.name,
              file_size: file.size,
              image_width: cloudinaryResult.width,
              image_height: cloudinaryResult.height,
            }),
          })

          const result = await response.json()
          setUploadProgress(100)

          if (result.success) {
            onUpload(result.photo)
            setTimeout(() => {
              setUploading(false)
              setUploadProgress(0)
            }, 1000)
          }
        } catch (error) {
          console.error("Upload error:", error)
          setUploading(false)
          setUploadProgress(0)
        }
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".heic", ".webp"],
    },
    maxSize: 10485760, // 10MB
    multiple: true,
  })

  if (uploading) {
    return <UploadProgress progress={uploadProgress} />
  }

  return (
    <div {...getRootProps()} className={`upload-zone ${isDragActive ? "drag-active" : ""}`}>
      <input {...getInputProps()} />
      <div className="upload-content">
        <div className="upload-icon text-6xl mb-4">📁</div>
        <p className="upload-text retro-font-primary mb-4">
          {isDragActive ? "Drop photos here..." : "Drag photos here or tap to browse"}
        </p>
        <RetroButton variant="primary" size="large">
          📷 Browse Files
        </RetroButton>
        <p className="text-xs mt-2 text-gray-600">Supports: JPG, PNG, HEIC, WebP (Max 10MB each)</p>
      </div>
    </div>
  )
}
