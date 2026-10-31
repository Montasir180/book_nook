"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

const REMEMBERED_PROFILE_KEY = "booknook:remembered-profile";

function subscribeToRememberedProfile(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getRememberedProfile() {
  try {
    return window.localStorage.getItem(REMEMBERED_PROFILE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerRememberedProfile() {
  return "";
}

function parseRememberedProfile(rawProfile) {
  if (!rawProfile) return { name: "", email: "" };

  try {
    const profile = JSON.parse(rawProfile);
    return {
      name: typeof profile.name === "string" ? profile.name : "",
      email: typeof profile.email === "string" ? profile.email : "",
    };
  } catch {
    return { name: "", email: "" };
  }
}

// Keep redirects inside this site so a crafted ?callbackURL cannot
// send readers to another domain after signing in.
function getSafeRedirect() {
  if (typeof window === "undefined") return "/";

  const callbackURL = new URLSearchParams(window.location.search).get(
    "callbackURL"
  );

  if (
    !callbackURL ||
    !callbackURL.startsWith("/") ||
    callbackURL.startsWith("//") ||
    callbackURL.startsWith("/\\")
  ) {
    return "/";
  }

  return callbackURL;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function GoogleIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();

  // Read remembered details without causing a hydration mismatch.
  const rememberedProfileRaw = useSyncExternalStore(
    subscribeToRememberedProfile,
    getRememberedProfile,
    getServerRememberedProfile
  );

  const rememberedProfile = parseRememberedProfile(
    rememberedProfileRaw
  );

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nameValue = name ?? rememberedProfile.name;
  const emailValue = email ?? rememberedProfile.email;
  const rememberChecked =
    rememberMe ??
    Boolean(rememberedProfile.name || rememberedProfile.email);

  const isBusy = submitting || googleLoading;

  const clearErrorFor = (field) => {
    if (error?.field === field) setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);
    setNotice("");

    if (nameValue.trim().length < 2) {
      setError({
        field: "name",
        message: "Please enter your name.",
      });
      return;
    }

    if (!isValidEmail(emailValue)) {
      setError({
        field: "email",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      setError({
        field: "password",
        message: "Your password must be at least 6 characters long.",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (rememberChecked) {
        window.localStorage.setItem(
          REMEMBERED_PROFILE_KEY,
          JSON.stringify({
            name: nameValue.trim(),
            email: emailValue.trim(),
          })
        );
      } else {
        window.localStorage.removeItem(REMEMBERED_PROFILE_KEY);
      }
    } catch {
      // Ignore storage failures.
    }

    // Preview sign-in. Replace this with your auth provider's sign-in call.
    await new Promise((resolve) => setTimeout(resolve, 700));

    router.push(getSafeRedirect());
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setNotice("");
    setGoogleLoading(true);

    // Preview OAuth flow. Replace this with your Google sign-in call,
    // for example: signIn("google", { callbackUrl: getSafeRedirect() })
    await new Promise((resolve) => setTimeout(resolve, 700));

    router.push(getSafeRedirect());
    router.refresh();
  };

  const handleForgotPassword = () => {
    setError(null);
    setNotice(
      "Password recovery is not connected yet. For now, sign in with any name, email, and a password of 6 or more characters."
    );
  };

  return (
    <section className="relative flex min-h-[calc(100svh-88px)] items-center justify-center overflow-hidden px-4 py-8 sm:py-10">

      {/* Background wash */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">

        <Image
          src="/hero_img_2.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F4EC]/80 via-[#F7F4EC]/92 to-[#F7F4EC]" />
        <div className="absolute -top-28 -left-28 size-80 rounded-full bg-[#D99A72]/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 size-80 rounded-full bg-[#E7DED0]/80 blur-3xl" />

      </div>

      <div className="relative w-full max-w-[420px]">

        <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-[#FFFDF8]/95 px-6 py-7 shadow-[0_30px_80px_-20px_rgba(37,39,34,0.3)] backdrop-blur-2xl sm:px-7">

          {/* Subtle glass highlight */}
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#B84E2D]/45 to-transparent" />

          {/* NAME SECTION */}
          <div className="text-center">

            <Link
              href="/"
              aria-label="BookNook home"
              className="group mx-auto flex w-fit items-center gap-2.5"
            >
              <Image
                src="/logo_book_nook.png"
                alt=""
                width={34}
                height={34}
                className="size-[34px] object-contain transition-transform duration-500 group-hover:scale-110"
              />

              <span className="font-serif text-[22px] font-bold tracking-tight text-[#252722]">
                BookNook
                <span className="text-[#B84E2D]">.</span>
              </span>
            </Link>

            <p className="mt-1.5 text-[9px] font-semibold tracking-[0.3em] text-[#A0988A] uppercase">
              A small online library
            </p>

            <h1 className="mt-5 font-serif text-[34px] leading-[1.05] font-medium tracking-[-0.04em] text-[#252722]">
              Welcome{" "}
              <span className="italic text-[#B84E2D]">back.</span>
            </h1>

            <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-5 text-[#6B6E63]">
              Sign in to return to your shelf and pick up where you
              left off.
            </p>

          </div>

          {/* GOOGLE SIGN IN */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#E2D8C8] bg-white text-[13px] font-medium text-[#3F423A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CFC2AE] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {googleLoading ? (
              <Loader2
                size={17}
                className="animate-spin text-[#B84E2D]"
              />
            ) : (
              <GoogleIcon className="size-[17px]" />
            )}

            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">

            <span className="h-px flex-1 bg-[#E7DED0]" />

            <span className="text-[9px] font-semibold tracking-[0.22em] text-[#A5A69C] uppercase">
              or with email
            </span>

            <span className="h-px flex-1 bg-[#E7DED0]" />

          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div>

              <label
                htmlFor="name"
                className="mb-1.5 block text-[12px] font-medium text-[#3F423A]"
              >
                Your name
              </label>

              <div className="relative">

                <User
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9A9C91]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Reader"
                  value={nameValue}
                  onChange={(event) => {
                    setName(event.target.value);
                    clearErrorFor("name");
                  }}
                  aria-invalid={error?.field === "name"}
                  aria-describedby={error ? "login-error" : undefined}
                  className={`h-11 w-full rounded-xl border bg-white/85 pr-3.5 pl-10 text-[13px] text-[#252722] shadow-sm outline-none transition-all duration-300 placeholder:text-[#A5A69C] focus:border-[#B84E2D] focus:ring-4 focus:ring-[#B84E2D]/10 ${
                    error?.field === "name"
                      ? "border-[#C75A3A]"
                      : "border-[#E2D8C8]"
                  }`}
                />

              </div>

            </div>

            {/* Email */}
            <div className="mt-4">

              <label
                htmlFor="email"
                className="mb-1.5 block text-[12px] font-medium text-[#3F423A]"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9A9C91]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={emailValue}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearErrorFor("email");
                  }}
                  aria-invalid={error?.field === "email"}
                  aria-describedby={error ? "login-error" : undefined}
                  className={`h-11 w-full rounded-xl border bg-white/85 pr-3.5 pl-10 text-[13px] text-[#252722] shadow-sm outline-none transition-all duration-300 placeholder:text-[#A5A69C] focus:border-[#B84E2D] focus:ring-4 focus:ring-[#B84E2D]/10 ${
                    error?.field === "email"
                      ? "border-[#C75A3A]"
                      : "border-[#E2D8C8]"
                  }`}
                />

              </div>

            </div>

            {/* Password */}
            <div className="mt-4">

              <div className="mb-1.5 flex items-center justify-between gap-3">

                <label
                  htmlFor="password"
                  className="text-[12px] font-medium text-[#3F423A]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-medium text-[#B84E2D] transition-colors hover:text-[#963C23] hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9A9C91]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearErrorFor("password");
                  }}
                  aria-invalid={error?.field === "password"}
                  aria-describedby={error ? "login-error" : undefined}
                  className={`h-11 w-full rounded-xl border bg-white/85 pr-11 pl-10 text-[13px] text-[#252722] shadow-sm outline-none transition-all duration-300 placeholder:text-[#A5A69C] focus:border-[#B84E2D] focus:ring-4 focus:ring-[#B84E2D]/10 ${
                    error?.field === "password"
                      ? "border-[#C75A3A]"
                      : "border-[#E2D8C8]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8D8F84] transition-colors hover:bg-[#F1EADF] hover:text-[#252722]"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember me */}
            <label className="mt-3.5 flex w-fit cursor-pointer items-center gap-2.5 text-[12px] text-[#5C5F56]">

              <input
                type="checkbox"
                checked={rememberChecked}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="size-4 cursor-pointer rounded border-[#CFC4B2] accent-[#B84E2D]"
              />

              Remember me

            </label>

            {/* Feedback */}
            {error ? (
              <p
                id="login-error"
                role="alert"
                className="mt-3.5 flex items-start gap-2 rounded-xl border border-[#C75A3A]/25 bg-[#C75A3A]/8 px-3.5 py-2.5 text-[11px] leading-5 text-[#A33F24]"
              >
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {error.message}
              </p>
            ) : null}

            {notice ? (
              <p
                role="status"
                className="mt-3.5 flex items-start gap-2 rounded-xl border border-[#E7DED0] bg-[#F7F4EC] px-3.5 py-2.5 text-[11px] leading-5 text-[#6B6E63]"
              >
                <Info
                  size={13}
                  className="mt-0.5 shrink-0 text-[#B84E2D]"
                />
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isBusy}
              className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B84E2D] text-[13px] font-semibold text-white shadow-lg shadow-[#B84E2D]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#963C23] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

          </form>

          <p className="mt-4 text-center text-[10px] leading-4 text-[#9A9C91]">
            <span className="font-semibold text-[#777A6F]">
              Preview mode:
            </span>{" "}
            any name, email, and 6+ character password will sign you in.
          </p>

        </div>

        <p className="mt-5 text-center font-serif text-[13px] italic text-[#7A7D72]">
          &ldquo;There is no friend as loyal as a book.&rdquo;
        </p>

      </div>

    </section>
  );
}
