import { ReactNode } from "react";

export type ProfileParams = {
  username: string;
};

import type {
  ProfileCertification,
  ProfileUser,
  UnlinkedCard,
} from "../../api/types";

export type User = ProfileUser;

/** { card_number, tapped_at } as GET /rfid_cards sends it. */
export type RfidInfo = UnlinkedCard;

export type Certification = ProfileCertification;

export interface RemainingTraining {
  id: number;
  name_en: string;
}

export interface UnlinkDialogState {
  open: boolean;
  cardNumber: string | null;
}

export interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string | null;
}