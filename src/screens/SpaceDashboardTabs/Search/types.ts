export interface User {
  id: string | number;
  name: string;
  username: string;
  email: string;
  flagged: boolean;
  avatar_url?: string;
}

export interface SearchUser {
  name: string;
  username: string;
}