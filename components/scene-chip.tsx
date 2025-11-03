"use client"

interface SceneChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function SceneChip({ label, selected = false, onClick }: SceneChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-semibold text-sm smooth-transition ${
        selected
          ? "glass-hover gradient-text border border-accent bg-accent/10"
          : "glass-hover border border-border hover:border-accent/50"
      }`}
    >
      {label}
    </button>
  )
}
