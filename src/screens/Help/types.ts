export interface FormData {
  name: string;
  email: string;
  subject: string;
  comments: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  comments?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactFormField {
  key: keyof FormData;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  icon: React.ReactElement;
  helperText?: string;
}