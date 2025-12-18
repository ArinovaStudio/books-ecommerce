"use client"

import { Search, X } from "lucide-react"

interface SchoolSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SchoolSearch({
  value,
  onChange,
  placeholder = "Search schools...",
  className = "",
}: SchoolSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-white w-full rounded-lg shadow p-3 flex items-center gap-3">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none text-gray-600"
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
