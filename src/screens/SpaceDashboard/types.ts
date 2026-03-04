import { ReactElement } from "react";

export interface SpaceData {
  space_users: SpaceUser[];
  space: {
    id: string | number;
    name?: string;
  };
  current_user?: {
    id: number;
    name?: string;
  };
}

export interface SpaceUser {
  id: number;
  username: string;
  name: string;
  email: string;
  flagged: boolean | null;
  flag_message?: string;
  avatar_url?: string;
  active: boolean;
  read_and_accepted_waiver_form: boolean;
  certifications?: { id: number; name: string }[];
  [key: string]: any;
}

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