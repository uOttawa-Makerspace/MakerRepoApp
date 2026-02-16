import { ReactNode } from "react";

export type ProfileParams = {
  username: string;
};

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  faculty?: string;
  program?: string;
  year_of_study?: string;
  identity?: string;
  role: string;
  avatar_url?: string;
  rfid?: {
    card_number: string;
  } | null;
}

export interface RfidInfo {
  cardNumber: string;
  tappedAt: string;
}

export interface Certification {
  id: number;
  training: {
    name_en: ReactNode;
    id: number;
    name: string;
  };
  updated_at: string;
  created_at: string;
}

export interface UnlinkDialogState {
  open: boolean;
  cardNumber: string | null;
}

export interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
}