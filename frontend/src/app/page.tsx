"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

const allowedDomains = [
  "upload.wikimedia.org",
  "instagram.com",
  "www.instagram.com",
  "unsplash.com",
  "www.biography.com",
  "encrypted-tbn0.gstatic.com",
  "encrypted-tbn1.gstatic.com",
  "encrypted-tbn2.gstatic.com",
  "encrypted-tbn3.gstatic.com",
  "encrypted-tbn.gstatic.com"
];

function isAllowedDomain(url: string) {
  try {
    const { hostname } = new URL(url);
    return allowedDomains.some(domain => hostname === domain || hostname.endsWith("." + domain));
  } catch {
    return false;
  }
}

export default function Home() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/celebrities")
      .then(res => res.json())
      .then(data => {
        setCelebrities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/celebrities/news")
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  const safeNews = Array.isArray(news) ? news : [];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">CelebNetwork.com</h1>
      {/* News Feed */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Latest Celebrity News</h2>
        {newsLoading ? (
          <div className="text-gray-400">Loading news...</div>
        ) : safeNews.length === 0 ? (
          <div className="text-gray-500">No news found.</div>
        ) : (
          <ul className="space-y-3">
            {safeNews.map((article, idx) => (
              <li key={idx} className="bg-white rounded p-3 shadow flex flex-col">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline">{article.title}</a>
                <div className="text-xs text-gray-500">{article.source?.name} &middot; {new Date(article.publishedAt).toLocaleDateString()}</div>
                {article.description && <div className="text-gray-700 mt-1">{article.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading ? (
        <div className="text-center text-gray-400">Loading celebrities...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {celebrities.map((celeb: any) => {
            const safePhotoUrl = celeb.photoUrl && isAllowedDomain(celeb.photoUrl)
              ? celeb.photoUrl
              : DEFAULT_AVATAR;
            return (
              <a
                key={celeb.id}
                href={`/celebrities/${celeb.id}`}
                className="bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center hover:bg-gray-700 transition cursor-pointer"
              >
                <Image
                  src={safePhotoUrl}
                  alt={celeb.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-full mb-3 border"
                  onError={(e: any) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                />
                <h2 className="text-lg font-semibold mb-1 text-white">{celeb.name}</h2>
                <div className="text-sm text-gray-300 mb-1">{celeb.category}</div>
                <div className="text-sm text-gray-400 mb-1">{celeb.country}</div>
                <div className="text-xs text-gray-400">Fanbase: {celeb.fanbase?.toLocaleString('en-US')}</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
