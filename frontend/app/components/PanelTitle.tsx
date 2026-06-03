import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function PanelTitle({
  icon,
  title,
  subtitle,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="panelHeader">
      <div className="panelTitle">
        {icon}
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {action && onAction ? (
        <button onClick={onAction} type="button">
          <ArrowUpRight size={16} aria-hidden />
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function statusClass(status: string) {
  const key = status.toLowerCase().replace(/\s+/g, "-");

  if (["active", "enabled", "healthy", "succeeded", "connected", "ready", "public"].includes(key)) {
    return "badge success";
  }

  if (["past-due", "retry-scheduled", "missing", "paused", "awaiting-payment", "suspended"].includes(key)) {
    return "badge warning";
  }

  return "badge neutral";
}
