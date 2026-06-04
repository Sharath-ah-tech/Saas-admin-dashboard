"use client";

import { Chrome, KeyRound, LogIn, Mail } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { apiBaseUrl } from "../lib/admin-data";

type Tab = "google" | "email";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function LoginPage() {
  const [tab, setTab] = useState<Tab>("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // ── Google One Tap / Sign-In button ─────────────────────────
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || tab !== "google") return;

    const initGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        shape: "rectangular",
        theme: "outline",
        text: "continue_with",
        size: "large",
        width: "100%",
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [tab]);

  async function handleGoogleCredential(credentialResponse: { credential: string }) {
    setIsSaving(true);
    setMessage("");
    setIsError(false);
    try {
      // Decode the JWT to get basic profile info (no sensitive data exposed)
      const payload = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      const response = await fetch(`${apiBaseUrl}/auth/google-login/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
          avatar_url: payload.picture ?? "",
          google_subject: payload.sub ?? "",
          id_token: credentialResponse.credential,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      setMessage("Signed in. Redirecting…");
      setTimeout(() => { window.location.href = "/"; }, 600);
    } catch (err) {
      setIsError(true);
      setMessage(`Google sign-in failed. ${err instanceof Error ? err.message : ""}`);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Fallback: redirect-based Google OAuth ───────────────────
  async function startGoogleRedirect() {
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/google/`, { credentials: "include" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setIsError(true);
      setMessage("Could not start Google sign-in. Make sure the Django server is running.");
      setIsSaving(false);
    }
  }

  // ── Email / Password ─────────────────────────────────────────
  async function emailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? response.statusText);
      }
      setMessage("Signed in. Redirecting…");
      setTimeout(() => { window.location.href = "/"; }, 600);
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="loginScreen">
      <section className="loginPanel">
        {/* Brand */}
        <div className="brand loginBrand">
          <div className="brandMark">
            <LogIn size={20} aria-hidden />
          </div>
          <div>
            <strong>AdminFlow</strong>
            <span>SaaS control center</span>
          </div>
        </div>

        <div>
          <p className="eyebrow">Authentication</p>
          <h1>Sign in to manage your SaaS platform.</h1>
        </div>

        {/* Tabs */}
        <div className="loginTabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "google"}
            className={tab === "google" ? "active" : ""}
            onClick={() => { setTab("google"); setMessage(""); }}
            type="button"
          >
            <Chrome size={15} aria-hidden /> Google
          </button>
          <button
            role="tab"
            aria-selected={tab === "email"}
            className={tab === "email" ? "active" : ""}
            onClick={() => { setTab("email"); setMessage(""); }}
            type="button"
          >
            <Mail size={15} aria-hidden /> Email
          </button>
        </div>

        {/* Google panel */}
        {tab === "google" && (
          <div className="loginForm">
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <>
                {/* Google Identity Services button (renders itself) */}
                <div ref={googleBtnRef} style={{ minHeight: 44 }} />
                <div className="loginDivider"><span>or</span></div>
              </>
            ) : null}
            <button
              type="button"
              disabled={isSaving}
              onClick={startGoogleRedirect}
              className="loginSecondaryBtn"
            >
              <Chrome size={18} aria-hidden />
              {isSaving ? "Redirecting…" : "Continue with Google (redirect)"}
            </button>
            <p className="loginHint">
              Redirects to Google and back. Requires{" "}
              <code>GOOGLE_CLIENT_ID</code> set on the backend.
            </p>
          </div>
        )}

        {/* Email / Password panel */}
        {tab === "email" && (
          <form className="loginForm" onSubmit={emailLogin}>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button disabled={isSaving} type="submit">
              <KeyRound size={18} aria-hidden />
              {isSaving ? "Signing in…" : "Sign in"}
            </button>
            <p className="loginHint">
              Only Django superusers or staff accounts can sign in here.
              Create one with{" "}
              <code>python manage.py createsuperuser</code>.
            </p>
          </form>
        )}

        {message && (
          <div className={`notice ${isError ? "error" : ""}`}>{message}</div>
        )}
      </section>
    </main>
  );
}