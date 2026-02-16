const DEFAULT_COLOR = "#3788d8";

export const extractColorFromBackground = (background?: string): string => {
  if (!background) return DEFAULT_COLOR;
  const match = background.match(/#[0-9A-Fa-f]{6}/);
  return match ? match[0] : DEFAULT_COLOR;
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateShort = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatWeekday = (date: Date): string =>
  date.toLocaleDateString("en-US", { weekday: "short" });

export const isSameDay = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString();

export const getWeekStart = (date: Date): Date => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return start;
};

export const SLOT_MIN_TIME = "07:00:00";
export const SLOT_MAX_TIME = "23:00:00";