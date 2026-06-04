"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiBaseUrl } from "../../lib/admin-data";

/**
 * After Django's python-social-auth redirects back to the frontend
 * at /auth/callback, this page checks /api/auth/me/ to confirm
 * the session is valid, then sends the user to the dashboard.
 */
export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing sign-in…");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      setMessage(`Sign-in failed: ${error}. Redirecting to login…`);
      setTimeout(() => { window.location.href = "/login"; }, 2500);
      return;
    }

    fetch(`${apiBaseUrl}/auth/me/`, { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setMessage("Signed in! Redirecting to dashboard…");
          setTimeout(() => { window.location.href = "/"; }, 600);
        } else {
          setMessage("Session not found. Redirecting to login…");
          setTimeout(() => { window.location.href = "/login"; }, 2000);
        }
      })
      .catch(() => {
        setMessage("Could not reach the API. Redirecting to login…");
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      });
  }, [error]);

  return (
    <main className="loginScreen">
      <section className="loginPanel">
        <p className="eyebrow">Authentication</p>
        <h1>{message}</h1>
      </section>
    </main>
  );
}