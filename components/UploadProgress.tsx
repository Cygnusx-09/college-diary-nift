interface UploadProgressProps {
  progress: number
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="upload-progress-container">
      <div className="upload-progress-icon">📤</div>
      <h3 className="retro-font-primary mb-4">Uploading Photo...</h3>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{progress}%</span>
      </div>

      <p className="text-sm mt-2 text-gray-600">
        {progress < 25 && "Preparing image..."}
        {progress >= 25 && progress < 50 && "Compressing..."}
        {progress >= 50 && progress < 75 && "Uploading..."}
        {progress >= 75 && progress < 100 && "Saving..."}
        {progress === 100 && "Complete! ✅"}
      </p>
    </div>
  )
}
