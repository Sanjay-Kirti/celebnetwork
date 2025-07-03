"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
      "encrypted-tbn2.gstatic.com"
    ];
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

async function fetchCelebrity(id: string) {
  const res = await fetch(`${API_URL}/celebrities/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function CelebrityProfile() {
  const params = useParams();
  const router = useRouter();
  const celebId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [celeb, setCeleb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const c = await fetchCelebrity(String(celebId));
      setCeleb(c);
      setLoading(false);
      // Check if following
      if (user && user.role === "fan") {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/fans/${user.id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const following = await res.json();
          setIsFollowing(following.some((f: any) => f.id == celebId));
        }
      }
      // Fetch news
      if (celebId) {
        try {
          const newsRes = await fetch(`${API_URL}/celebrities/${String(celebId)}/news`);
          if (newsRes.ok) {
            const newsData = await newsRes.json();
            setNews(newsData);
          }
        } catch {}
      }
    }
    if (celebId) load();
  }, [celebId, user]);

  const handleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/fans/${user.id}/follow/${celebId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setIsFollowing(true);
    setFollowLoading(false);
  };

  const handleUnfollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/fans/${user.id}/unfollow/${celebId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setIsFollowing(false);
    setFollowLoading(false);
  };

  const handleDownloadPdf = async () => {
    const response = await fetch(`${API_URL}/celebrities/${celebId}/pdf`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celebrity-${celebId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!celeb) return <div className="text-center py-10 text-red-500">Celebrity not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg shadow p-8 flex flex-col items-center">
      <div className="w-full flex justify-between mb-4">
        <a href="/" className="text-blue-600 hover:underline">Home</a>
        <a href="/search" className="text-blue-600 hover:underline">Search</a>
        {user?.role === "fan" && <a href="/dashboard/fan" className="text-blue-600 hover:underline">Fan Dashboard</a>}
        {user?.role === "celebrity" && <a href="/dashboard/celebrity" className="text-blue-600 hover:underline">Celebrity Dashboard</a>}
      </div>
      {celeb.photoUrl && (
        <Image src={getValidPhotoUrl(celeb.photoUrl)} alt={celeb.name} width={128} height={128} className="w-32 h-32 object-cover rounded-full mb-4 border" />
      )}
      <h1 className="text-2xl font-bold mb-2 text-gray-900">{celeb.name}</h1>
      <div className="text-gray-700 mb-1">{celeb.category} • {celeb.country}</div>
      <div className="text-gray-500 mb-2">Fanbase: {celeb.fanbase?.toLocaleString?.('en-US') ?? celeb.fanbase}</div>
      {celeb.instagram && (
        <a href={celeb.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-2">Instagram</a>
      )}
      {celeb.setlist && (
        <div className="mb-2"><span className="font-semibold">Setlist / Topics:</span> {celeb.setlist}</div>
      )}
      {celeb.bio && (
        <div className="text-center text-gray-800 mt-4">{celeb.bio}</div>
      )}
      {user?.role === "fan" && (
        <button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={`mt-6 px-6 py-2 rounded text-white font-semibold ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={followLoading}
        >
          {followLoading ? (isFollowing ? "Unfollowing..." : "Following...") : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
      <button
        onClick={handleDownloadPdf}
        className="mt-4 px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        Download PDF
      </button>
      {/* News Feed */}
      <div className="w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        {news.length === 0 && <div className="text-gray-500">No news found.</div>}
        <ul className="space-y-3">
          {news.map((article, idx) => (
            <li key={idx} className="bg-white rounded p-3 shadow flex flex-col">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline">{article.title}</a>
              <div className="text-xs text-gray-500">{article.source?.name} &middot; {new Date(article.publishedAt).toLocaleDateString()}</div>
              {article.description && <div className="text-gray-700 mt-1">{article.description}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 