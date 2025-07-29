"use client"

import type React from "react"

interface RetroButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger"
  size?: "small" | "medium" | "large"
  className?: string
  disabled?: boolean
}

export function RetroButton({
  children,
  onClick,
  variant = "secondary",
  size = "medium",
  className = "",
  disabled = false,
}: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`retro-button ${variant} ${size} ${className} ${disabled ? "disabled" : ""}`}
    >
      {children}
    </button>
  )
}
