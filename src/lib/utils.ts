import { clsx, type ClassValue } from "clsx";
import { categories } from "./data";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Convert category slug to display name.
 * Returns the category name if found, otherwise returns the slug with proper casing.
 */
export function getCategoryDisplayName(slugOrName: string): string {
  // If it already looks like a display name (has space or capital letter), return as-is
  if (/[A-Z ]/.test(slugOrName) && !slugOrName.includes("-")) {
    return slugOrName;
  }
  // Try to find matching category
  const cat = categories.find((c) => c.slug === slugOrName);
  if (cat) return cat.name;
  // Fallback: convert slug to Title Case
  return slugOrName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
