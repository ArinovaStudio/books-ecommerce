"use client"

import { Search, X } from "lucide-react"

interface School {
  id: number
  slug: string
  name: string
  location: string
  city: string
  image: string
}

interface SchoolSearchProps {
  value: string
  onChange: (value: string) => void
  results?: Pick<School, "id" | "name">[]
  placeholder?: string
  className?: string
}


export default function SchoolSearch({
  value,
  onChange,results,
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
      {value && results && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow">
          {results.slice(0, 5).map((school) => (
            <div
              key={school.id}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => onChange(school.name)}
            >
              {school.name}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
