"use client";

import { LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="userMenu" ref={ref}>
      <button
        className="userMenuTrigger"
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="userAvatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} referrerPolicy="no-referrer" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="userName">{user.name}</span>
        <ChevronDown size={14} className={`userChevron ${open ? "open" : ""}`} aria-hidden />
      </button>

      {open && (
        <div className="userDropdown" role="menu">
          <div className="userDropdownInfo">
            <span className="userDropdownName">{user.name}</span>
            <span className="userDropdownEmail">{user.email}</span>
          </div>
          <div className="userDropdownDivider" />
          <button
            className="userDropdownItem danger"
            onClick={() => { setOpen(false); logout(); }}
            type="button"
            role="menuitem"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}