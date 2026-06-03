"use client";

import { Chrome, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";

import { apiBaseUrl } from "../lib/admin-data";

export function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [name, setName] = useState("SaaS Admin");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          avatar_url: "",
          google_subject: `test-google-${email}`,
          id_token: "test-google-id-token",
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Google login stored in the database. Redirecting to dashboard...");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (error) {
      setMessage(`Login could not be stored. Check that Django/MySQL is running. ${error instanceof Error ? error.message : ""}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="loginScreen">
      <section className="loginPanel">
        <div className="brand loginBrand">
          <div className="brandMark">
            <LogIn size={20} aria-hidden />
          </div>
          <div>
            <strong>AdminFlow</strong>
            <span>Google admin sign-in</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Authentication</p>
          <h1>Sign in to manage your SaaS platform.</h1>
        </div>
        <form className="loginForm" onSubmit={login}>
          <label>
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>Google email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button disabled={isSaving} type="submit">
            <Chrome size={18} aria-hidden />
            {isSaving ? "Signing in..." : "Continue with Google"}
          </button>
        </form>
        {message ? <div className="notice">{message}</div> : null}
      </section>
    </main>
  );
}
