import type { SessionUser } from "../../api/types";

export interface LoginProps {
  setUser: (user: SessionUser) => void;
}

export interface FormData {
  usernameEmail: string;
  password: string;
}

export interface FormErrors {
  usernameEmail?: string;
  password?: string;
}