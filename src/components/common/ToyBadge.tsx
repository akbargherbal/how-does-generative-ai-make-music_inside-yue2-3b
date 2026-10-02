import React from "react";
import { Info } from "lucide-react";

interface ToyBadgeProps {
  text?: string;
  className?: string;
}

export const ToyBadge: React.FC<ToyBadgeProps> = ({
  text = "Toy demo — illustrates the idea, not YuE2's actual numbers.",
  className = ""
}) => {
  return (
    <div
      role="note"
      aria-label="Toy demonstration notice"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
};
