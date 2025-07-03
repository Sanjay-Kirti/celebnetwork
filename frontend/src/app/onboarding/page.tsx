"use client";
import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const initialState = {
  name: "",
  category: "",
  country: "",
  instagram: "",
  fanbase: "",
  photoUrl: "",
  setlist: "",
};

const mockAIFill = {
  name: "Diljit Dosanjh",
  category: "Singer",
  country: "India",
  instagram: "https://instagram.com/diljitdosanjh",
  fanbase: "2000000",
  photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
  setlist: "Coachella 2023, Born to Shine, G.O.A.T.",
};

export default function CelebrityOnboarding() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAIFill = async () => {
    setError("");
    if (!form.name) {
      setError("Please enter a celebrity name first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/celebrities/ai-autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      if (!res.ok) throw new Error("AI autofill failed");
      const data = await res.json();
      setForm({
        name: data.name || form.name,
        category: data.category || "",
        country: data.country || "",
        instagram: data.instagram || "",
        fanbase: data.fanbase ? String(data.fanbase) : "",
        photoUrl: data.photoUrl || "",
        setlist: data.setlist || "",
      });
    } catch (err: any) {
      setError(err.message || "AI autofill failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    if (!form.name || !form.category || !form.country || !form.fanbase || Number(form.fanbase) < 1000) {
      setError("Please fill all required fields and ensure fanbase is at least 1000.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/celebrities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fanbase: Number(form.fanbase),
        }),
      });
      if (!res.ok) throw new Error("API error: " + res.status);
      setSubmitted(true);
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Celebrity Onboarding</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Category *</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Country *</label>
          <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Instagram</label>
          <input name="instagram" value={form.instagram} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" type="url" />
        </div>
        <div>
          <label className="block font-medium mb-1">Fanbase *</label>
          <input name="fanbase" value={form.fanbase} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" type="number" min={1000} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Photo URL</label>
          <input name="photoUrl" value={form.photoUrl} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" type="url" />
        </div>
        <div>
          <label className="block font-medium mb-1">Setlist / Keynote Topics</label>
          <textarea name="setlist" value={form.setlist} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" rows={2} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button type="button" onClick={handleAIFill} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>{loading ? "Autofilling..." : "AI Auto-Fill"}</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        </div>
        {submitted && <div className="text-green-600 font-semibold mt-2">Celebrity onboarded successfully!</div>}
      </form>
    </div>
  );
} 