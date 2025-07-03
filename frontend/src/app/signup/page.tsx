"use client";
import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("fan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Registration failed");
      setSuccess(true);
      setEmail("");
      setPassword("");
      setRole("fan");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300">
            <option value="fan">Fan</option>
            <option value="celebrity">Celebrity</option>
          </select>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600 font-semibold">Registration successful! You can now log in.</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
      </form>
    </div>
  );
} 