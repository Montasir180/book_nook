"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X, LogOut } from "lucide-react";

const navLinks = [
  { name: "All Books", href: "/books" },
  { name: "My Books", href: "/my-books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar({
  user = null,
  authLoading = false,
  onLogout,
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = Boolean(user);

  // Active route checker
  const isActive = (href) => {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // Logout handler
  const handleLogout = async () => {
    setMobileOpen(false);

    if (!onLogout) return;

    try {
      await onLogout();
    } catch (error) {
      console.error("BookNook logout failed:", error);
    }
  };

  return (
    <>
      <header className="sticky top-3 z-50 px-3 sm:px-6">

        <div className="liquid-navbar relative mx-auto max-w-7xl">

          {/* Glass Reflection */}
          <div className="glass-shine pointer-events-none absolute inset-0" />

          <div className="relative z-10 grid h-[68px] grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">

            {/* LEFT - LOGO */}
            <div className="flex items-center">

              <Link
                href="/"
                className="group flex items-center gap-2.5"
              >
                <Image
                  src="/logo_book_nook.png"
                  alt="BookNook"
                  width={42}
                  height={42}
                  priority
                  className="size-10 object-contain transition-transform duration-500 group-hover:scale-110"
                />

                <span className="font-serif text-2xl font-bold tracking-tight text-[#252722]">
                  BookNook
                  <span className="text-[#B84E2D]">.</span>
                </span>
              </Link>

            </div>

            {/* MIDDLE - DESKTOP NAVIGATION */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center justify-center gap-2 lg:flex"
            >

              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                      active
                        ? "text-[#B84E2D]"
                        : "text-[#55584F] hover:text-[#B84E2D]"
                    }`}
                  >
                    {link.name}

                    {/* Active Underline */}
                    <span
                      className={`absolute bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#B84E2D] transition-all duration-300 ${
                        active
                          ? "w-5"
                          : "w-0 group-hover:w-5"
                      }`}
                    />

                  </Link>
                );
              })}

            </nav>

            {/* RIGHT - LOGIN / LOGOUT */}
            <div className="hidden items-center justify-end lg:flex">

              {authLoading ? (

                <div className="h-10 w-24 animate-pulse rounded-xl bg-[#E7DED0]" />

              ) : isLoggedIn ? (

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={!onLogout}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#B84E2D] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#963C23] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Logout

                  <LogOut
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

              ) : (

                <Link
                  href="/login"
                  className="rounded-xl bg-[#B84E2D] px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-[#B84E2D]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#963C23] hover:shadow-lg"
                >
                  Login
                </Link>

              )}

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="flex size-10 items-center justify-center rounded-xl border border-white/70 bg-white/50 transition-all duration-300 hover:bg-white lg:hidden"
            >
              {mobileOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>

          {/* MOBILE NAVIGATION */}
          {mobileOpen && (

            <div
              id="mobile-navigation"
              className="mobile-menu relative z-10 mx-3 mb-3 rounded-2xl border border-white/70 bg-[#F7F4EC]/95 p-4 shadow-xl backdrop-blur-2xl lg:hidden"
            >

              {/* All Navigation Links */}
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >

                {navLinks.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-[#B84E2D]/10 text-[#B84E2D]"
                          : "text-[#252722] hover:bg-white/80"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

              </nav>

              {/* Mobile Login / Logout */}
              <div className="mt-4 border-t border-[#E7DED0] pt-4">

                {authLoading ? (

                  <div className="h-11 animate-pulse rounded-xl bg-[#E7DED0]" />

                ) : isLoggedIn ? (

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={!onLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B84E2D] py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#963C23] disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                ) : (

                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl bg-[#B84E2D] py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-[#963C23]"
                  >
                    Login
                  </Link>

                )}

              </div>

            </div>

          )}

        </div>

      </header>

      {/* LIQUID GLASS STYLES */}
      <style >{`

        .liquid-navbar {
          isolation: isolate;
          overflow: visible;

          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 18px;

          background: rgba(247, 244, 236, 0.72);

          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);

          box-shadow:
            0 8px 32px rgba(37, 39, 34, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);

          transition:
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .liquid-navbar:hover {
          border-color: rgba(255, 255, 255, 0.95);

          box-shadow:
            0 12px 38px rgba(37, 39, 34, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .glass-shine {
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;

          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(255, 255, 255, 0.32) 48%,
            transparent 72%
          );

          background-size: 220% 100%;

          animation: glass-reflection 9s ease-in-out infinite;
        }

        @keyframes glass-reflection {
          0%, 100% {
            background-position: 100% 0;
          }

          50% {
            background-position: 0 0;
          }
        }

        .mobile-menu {
          animation: menu-enter 0.3s ease-out;
        }

        @keyframes menu-enter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glass-shine,
          .mobile-menu {
            animation: none;
          }
        }

      `}</style>

    </>
  );
}