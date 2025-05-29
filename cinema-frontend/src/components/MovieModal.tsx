"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaTimes, FaSave } from "react-icons/fa"
import type { Movie, CreateMovieData } from "../services/api"

interface MovieModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (movie: CreateMovieData) => void
  movie?: Movie | null
  loading?: boolean
}

const MovieModal: React.FC<MovieModalProps> = ({ isOpen, onClose, onSave, movie, loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    release_year: "",
    poster_url: "",
    description: "",
    director: "",
    actors: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (movie) {
      // Editing existing movie - handle optional properties safely
      setFormData({
        title: movie.title || "",
        duration: movie.duration ? movie.duration.toString() : "",
        release_year: movie.release_year ? movie.release_year.toString() : "",
        poster_url: movie.poster_url || "",
        description: movie.description || "",
        director: movie.director || "",
        actors: Array.isArray(movie.actors) ? movie.actors.join(", ") : movie.actors || "",
      })
    } else {
      // Adding new movie
      setFormData({
        title: "",
        duration: "",
        release_year: "",
        poster_url: "",
        description: "",
        director: "",
        actors: "",
      })
    }
    setErrors({})
  }, [movie, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.release_year.trim()) {
      newErrors.release_year = "Release year is required"
    } else if (
      isNaN(Number(formData.release_year)) ||
      Number(formData.release_year) < 1900 ||
      Number(formData.release_year) > new Date().getFullYear() + 5
    ) {
      newErrors.release_year = "Please enter a valid release year"
    }

    if (!formData.poster_url.trim()) {
      newErrors.poster_url = "Poster URL is required"
    }

    if (formData.duration.trim() && (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)) {
      newErrors.duration = "Duration must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Convert actors string to array
    const actorsArray = formData.actors
      .split(",")
      .map((actor) => actor.trim())
      .filter(Boolean)

    const movieData: CreateMovieData = {
      title: formData.title,
      duration: formData.duration ? Number(formData.duration) : undefined,
      release_year: Number(formData.release_year),
      poster_url: formData.poster_url,
      description: formData.description || undefined,
      director: formData.director || undefined,
      actors: actorsArray.length > 0 ? actorsArray : undefined,
    }

    onSave(movieData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{movie ? "Edit Movie" : "Add New Movie"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-2 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter movie title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={`w-full p-2 border rounded-lg ${errors.duration ? "border-red-500" : "border-gray-300"}`}
                placeholder="120"
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Year *</label>
              <input
                type="number"
                value={formData.release_year}
                onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                className={`w-full p-2 border rounded-lg ${errors.release_year ? "border-red-500" : "border-gray-300"}`}
                placeholder="2024"
              />
              {errors.release_year && <p className="text-red-500 text-xs mt-1">{errors.release_year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Director name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL *</label>
            <input
              type="url"
              value={formData.poster_url}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              className={`w-full p-2 border rounded-lg ${errors.poster_url ? "border-red-500" : "border-gray-300"}`}
              placeholder="https://example.com/poster.jpg"
            />
            {errors.poster_url && <p className="text-red-500 text-xs mt-1">{errors.poster_url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actors (comma separated)</label>
            <input
              type="text"
              value={formData.actors}
              onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Actor 1, Actor 2, Actor 3"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple actors with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Movie description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FaSave className="mr-2" />
              )}
              {movie ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MovieModal
