export interface Certification {
  id: number;
  name: string;
}

export interface User {
  id: number | string;
  username: string;
  name: string;
  email: string;
  flagged: boolean | null;
  flag_message?: string;
  avatar_url?: string;
  active: boolean;
  signed_safety_sheet: boolean;
  membership_status: boolean;
  certifications?: Certification[];
}

export interface DashboardProps {
  inSpaceUsers: User[];
  handleReloadCurrentUsers: () => void;
  spaceId: string | number | undefined;
  spaceName?: string;
}

export type SortField = "name" | "email" | "flagged";
export type SortOrder = "asc" | "desc";

export interface SignOutDialogState {
  open: boolean;
  user: User | null;
}