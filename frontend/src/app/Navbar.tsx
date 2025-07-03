"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "CelebNetwork" },
  { href: "/search", label: "Search" },
  { href: "/onboarding", label: "Onboarding" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-gray-100 border-b border-gray-200 shadow flex items-center px-6 py-4 min-h-[72px]">
      <div className="flex-1 flex items-center gap-8">
        {navLinks.map((link, idx) => (
          <a
            key={link.href}
            href={link.href}
            className={
              (pathname === link.href || (link.href === "/" && pathname === "/"))
                ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition"
                : idx === 0
                ? "text-xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            {link.label}
          </a>
        ))}
        {/* Dashboard links based on role */}
        {user?.role === "fan" && (
          <a
            href="/dashboard/fan"
            className={
              pathname === "/dashboard/fan"
                ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Fan Dashboard
          </a>
        )}
        {user?.role === "celebrity" && (
          <a
            href="/dashboard/celebrity"
            className={
              pathname === "/dashboard/celebrity"
                ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Celebrity Dashboard
          </a>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">{user.email} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className={
                pathname === "/login"
                  ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Login
            </a>
            <a
              href="/signup"
              className={
                pathname === "/signup"
                  ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
} 