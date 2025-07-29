"use client"

import { RetroButton } from "./RetroButton"

const categories = [
  { name: "all", display: "🌟 All Photos", emoji: "🌟" },
  { name: "orientation", display: "🎓 Orientation", emoji: "🎓" },
  { name: "campus", display: "🏫 Campus Tour", emoji: "🏫" },
  { name: "activities", display: "🎨 Activities", emoji: "🎨" },
  { name: "food", display: "🍕 Food & Fun", emoji: "🍕" },
  { name: "friends", display: "👥 New Friends", emoji: "👥" },
  { name: "selfies", display: "🤳 Selfies", emoji: "🤳" },
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <div className="category-buttons">
        {categories.map((category) => (
          <RetroButton
            key={category.name}
            variant={selectedCategory === category.name ? "primary" : "secondary"}
            size="small"
            onClick={() => onCategoryChange(category.name)}
            className="category-button"
          >
            {category.display}
          </RetroButton>
        ))}
      </div>
    </div>
  )
}
