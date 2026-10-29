import { ReactElement } from "react";

import type { PresenceUser, SpaceDashboardData } from "../../api/types";

/** The caller's space, who is in it, and every space (for the picker). */
export type SpaceData = SpaceDashboardData;

export type SpaceUser = PresenceUser;

export interface LoadingState {
  users: boolean;
  sessions: boolean;
  printers: boolean;
}

export interface ErrorState {
  users: string | null;
  sessions: string | null;
  printers: string | null;
}

export interface TabConfig {
  label: string;
  icon: ReactElement;
  color: string;
}