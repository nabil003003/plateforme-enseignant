import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateArabic(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("ar-MA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function formatStudentCountArabic(count: number): string {
  if (count === 0) return "لا يوجد طلاب";
  if (count === 1) return "طالب واحد";
  if (count === 2) return "طالبان";
  if (count >= 3 && count <= 10) return `${count} طلاب`;
  return `${count} طالبًا`;
}
