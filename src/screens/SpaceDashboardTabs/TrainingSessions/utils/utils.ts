import type { TrainingSession, SortField, SortOrder } from "../types";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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