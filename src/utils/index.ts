import type { TableRowI } from "../staticData";

export const statusTheme: Record<
  TableRowI["status"],
  "success" | "warning" | "danger"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

export const getNameIntials = (name: string) => {
  if (!name) return null;

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2);
  } else {
    return nameParts
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2);
  }
};

export const hexToRgba = (hex: string, alpha = 0.15) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}m : ${s
    .toString()
    .padStart(2, "0")}s`;
};
