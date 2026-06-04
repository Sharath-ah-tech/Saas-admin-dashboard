"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="authLoading">
        <div className="authSpinner" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}