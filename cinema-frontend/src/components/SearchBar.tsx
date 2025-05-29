"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiSearch } from "react-icons/fi"

interface SearchBarProps {
  onSearch?: (query: string) => void // Optional prop for inline search
  initialQuery?: string // Optional initial query value
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // If onSearch prop is provided, use it (for inline search)
    if (onSearch) {
      onSearch(query)
    } else {
      // Otherwise, navigate to search page (original behavior)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
      {/* Accessible label for screen readers */}
      <label htmlFor="search" className="sr-only">
        Search movies
      </label>

      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>

      {/* Input field with all accessibility attributes */}
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Search movies..."
        className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        aria-label="Search movies"
        autoComplete="off"
      />

      {/* Optional search suggestions dropdown */}
      {isFocused && query && (
        <div
          role="listbox"
          className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700"
        >
          {/* Search suggestions would be rendered here */}
          <div className="p-2 text-gray-400">Results for "{query}"</div>
        </div>
      )}
    </form>
  )
}

export default SearchBar
