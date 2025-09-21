import type { TableRowI } from "../staticData";

export const statusTheme: Record<
  TableRowI["status"],
  "success" | "warning" | "danger"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};
