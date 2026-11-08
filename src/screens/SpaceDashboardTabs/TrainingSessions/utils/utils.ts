import type { TrainingSession, SortField, SortOrder } from "../types";

// Whole calendar days between two instants, in the local time zone. Uses
// UTC-midnight stamps of the local Y/M/D so DST shifts cannot skew the count.
const calendarDaysBetween = (from: Date, to: Date): number =>
  Math.round(
    (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) -
      Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) /
      86_400_000
  );

export const formatDate = (
  dateString: string,
  now: Date = new Date()
): string => {
  const date = new Date(dateString);
  const diffDays = Math.max(0, calendarDaysBetween(date, now));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const isSessionCompleted = (session: TrainingSession): boolean =>
  session.certifications.length > 0;

export const sortSessions = (
  sessions: TrainingSession[],
  field: SortField,
  order: SortOrder
): TrainingSession[] => {
  const sorted = [...sessions].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "date":
        comparison =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case "training":
        comparison = (a.training?.name_en ?? "").localeCompare(
          b.training?.name_en ?? ""
        );
        break;
      case "space":
        comparison = (a.space?.name ?? "").localeCompare(b.space?.name ?? "");
        break;
      case "course":
        comparison = (a.course ?? "").localeCompare(b.course ?? "");
        break;
      case "status":
        comparison =
          (a.certifications.length > 0 ? 1 : 0) -
          (b.certifications.length > 0 ? 1 : 0);
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return sorted;
};