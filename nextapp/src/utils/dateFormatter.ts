export function dateFormatter(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
