import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

export function getOverspends(rows:{ category:string; budget:number; spent:number }[]) {
  return rows.filter(r => r.spent > r.budget)
             .map(r => ({ ...r, diff: r.spent - r.budget }));
}
