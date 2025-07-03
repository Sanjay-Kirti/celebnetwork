"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type Celebrity = {
  id: number;
  name: string;
  fanbase: number;
  photoUrl?: string;
  category?: string;
  country?: string;
  setlist?: string;
};

export default function CelebrityDashboard() {
  const [celeb, setCeleb] = useState<Celebrity | null>(null);
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
      if (user.role !== "celebrity") {
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
    async function fetchCeleb() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/celebrities`);
        if (!res.ok) throw new Error("API error: " + res.status);
        const data = await res.json();
        setCeleb(data[0] || null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCeleb();
  }, [authChecked]);

  if (!authChecked) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Celebrity Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {celeb && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-gray-100 rounded-lg p-6 shadow flex flex-col items-center">
            <div className="text-3xl font-bold mb-2 text-blue-600">{celeb.fanbase?.toLocaleString('en-US') ?? 0}</div>
            <div className="text-lg text-gray-700">Fans</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 shadow flex flex-col items-center">
            <div className="text-3xl font-bold mb-2 text-blue-600">--</div>
            <div className="text-lg text-gray-700">Profile Visits</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 shadow flex flex-col items-center">
            <div className="text-3xl font-bold mb-2 text-blue-600">--</div>
            <div className="text-lg text-gray-700">Engagement Rate</div>
          </div>
        </div>
      )}
      {!loading && !celeb && !error && (
        <div className="text-gray-500">No celebrity data found.</div>
      )}
    </div>
  );
} 