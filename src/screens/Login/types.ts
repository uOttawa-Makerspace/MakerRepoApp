export interface LoginProps {
  setUser: (user: any) => void;
}

export interface FormData {
  usernameEmail: string;
  password: string;
}

export interface FormErrors {
  usernameEmail?: string;
  password?: string;
}