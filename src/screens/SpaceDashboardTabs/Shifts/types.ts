export type ExtendedProps = {
  reason?: string;
  training?: string;
  course?: string;
  language?: string;
  name?: string;
  draft?: boolean;
  description?: string;
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