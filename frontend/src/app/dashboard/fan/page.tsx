"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const allowedDomains = [
  "upload.wikimedia.org",
  "unsplash.com",
  "www.biography.com",
];

type Celebrity = {
  id: number;
  name: string;
  category: string;
  photoUrl?: string;
};

function getValidPhotoUrl(photoUrl?: string) {
  try {
    if (!photoUrl) return "/default-avatar.png";
    const url = new URL(photoUrl);
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      allowedDomains.includes(url.hostname)
    ) {
      return photoUrl;
    }
  } catch {
    // invalid URL
  }
  return "/default-avatar.png";
}

export default function FanDashboard() {
  const [celebs, setCelebs] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Auth check
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userStr) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "fan") {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    async function fetchCelebs() {
      setLoading(true);
      setError("");
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!userStr || !token) throw new Error("Not authenticated");
        const user = JSON.parse(userStr);
        const res = await fetch(`${API_URL}/fans/${user.id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("API error: " + res.status);
        const data = await res.json();
        setCelebs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCelebs();
  }, [authChecked]);

  if (!authChecked) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fan Dashboard</h1>
      <div className="bg-gray-100 rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Celebrities You Follow</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {celebs.length === 0 && !loading && (
            <div className="text-gray-500 col-span-full">You are not following any celebrities yet.</div>
          )}
          {celebs.map(celeb => (
            <a
              key={celeb.id}
              href={`/celebrities/${celeb.id}`}
              className="flex items-center gap-4 bg-white rounded p-3 shadow hover:bg-blue-50 transition cursor-pointer"
            >
              <Image
                src={getValidPhotoUrl(celeb.photoUrl)}
                alt={celeb.name}
                width={56}
                height={56}
                className="w-14 h-14 object-cover rounded-full border"
              />
              <div>
                <div className="font-semibold text-gray-900">{celeb.name}</div>
                <div className="text-sm text-gray-500">{celeb.category}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 