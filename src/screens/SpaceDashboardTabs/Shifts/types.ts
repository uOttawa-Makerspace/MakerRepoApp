export type ExtendedProps = {
  reason?: string;
  // Not sent by /api/v1 (the shift card reads them if they ever are).
  training?: string;
  course?: string;
  name?: string;
  draft?: boolean;
  description?: string | null;
  eventType?: string;
  hasCurrentUser?: boolean;
  background?: string;
};

export type Shift = {
  id?: string;
  title: string;
  start: string;
  end: string;
  color?: string;
  rrule?: string;
  duration?: number;
  allDay?: boolean;
  extendedProps?: ExtendedProps;
};

export type ShiftsProps = {
  reloadShifts: number;
  spaceId?: number;
  currentUserId?: number;
};

export type MobileView = "day" | "week" | "list";

export type DayShifts = {
  date: Date;
  shifts: Shift[];
};