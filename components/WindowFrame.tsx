import type React from "react"
interface WindowFrameProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function WindowFrame({ title, children, className = "" }: WindowFrameProps) {
  return (
    <div className={`retro-window ${className}`}>
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button className="title-bar-control" aria-label="Minimize">
            _
          </button>
          <button className="title-bar-control" aria-label="Maximize">
            □
          </button>
          <button className="title-bar-control" aria-label="Close">
            ×
          </button>
        </div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
