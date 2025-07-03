"use client";
import React, { useState } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getValidPhotoUrl(photoUrl?: string) {
  try {
    if (!photoUrl) return "/default-avatar.png";
    const url = new URL(photoUrl);
    const allowedDomains = [
      "upload.wikimedia.org",
      "unsplash.com",
      "www.biography.com",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn2.gstatic.com",
      "encrypted-tbn3.gstatic.com",
      "encrypted-tbn*.gstatic.com"
    ];
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      allowedDomains.some(domain => url.hostname === domain || (domain.includes('*') && url.hostname.startsWith(domain.replace('*', ''))))
    ) {
      return photoUrl;
    }
  } catch {
    // invalid URL
  }
  return "/default-avatar.png";
}

type Celebrity = {
  name: string;
  photoUrl: string;
  id?: number;
};

export default function CelebritySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`${API_URL}/celebrities/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("API error: " + res.status);
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Celebrity AI Search</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2 bg-gray-100 text-gray-900 border-gray-300"
          type="text"
          placeholder='e.g. "Punjabi Singer from India who performed at Coachella"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {results.map((celeb: any, idx) => (
          celeb.id ? (
            <a
              key={celeb.id}
              href={`/celebrities/${celeb.id}`}
              className="flex items-center gap-4 border border-gray-200 p-3 rounded shadow bg-gray-50 hover:bg-blue-50 transition cursor-pointer"
            >
              <Image src={getValidPhotoUrl(celeb.photoUrl)} alt={celeb.name} width={64} height={64} className="w-16 h-16 object-cover rounded-full" />
              <span className="font-semibold text-gray-900">{celeb.name}</span>
            </a>
          ) : (
            <div key={idx} className="flex items-center gap-4 border border-gray-200 p-3 rounded shadow bg-gray-50">
              <Image src={getValidPhotoUrl(celeb.photoUrl)} alt={celeb.name} width={64} height={64} className="w-16 h-16 object-cover rounded-full" />
              <span className="font-semibold text-gray-900">{celeb.name}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
} 