export interface User {
  id: number | string;
  username: string;
  name: string;
  email: string;
  flagged: boolean;
  avatar_url?: string;
}

export interface DashboardProps {
  inSpaceUsers: User[];
  handleReloadCurrentUsers: () => void;
  spaceId: string | number | undefined;
}

export type SortField = "name" | "email" | "flagged";
export type SortOrder = "asc" | "desc";

export interface SignOutDialogState {
  open: boolean;
  user: User | null;
}