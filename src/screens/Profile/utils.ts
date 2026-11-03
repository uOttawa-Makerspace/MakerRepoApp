import React from "react";
import { ApiError } from "../../api/client";
import {
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getRoleColor = (
  role: string
): "error" | "warning" | "default" => {
  switch (role) {
    case "admin":
      return "error";
    case "staff":
      return "warning";
    default:
      return "default";
  }
};

export const getRoleIcon = (role: string): React.ReactElement => {
  switch (role) {
    case "admin":
      return React.createElement(AdminIcon);
    case "staff":
      return React.createElement(WorkIcon);
    default:
      return React.createElement(PersonIcon);
  }
};
/** "5 minutes ago" from the ISO timestamp GET /rfid_cards sends (the API no longer sends a sentence). */
export const formatTappedAt = (tappedAt: string): string => {
  const time = Date.parse(tappedAt);
  if (Number.isNaN(time)) return tappedAt;
  const seconds = Math.round((time - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(seconds, "second");
};

export const LINK_CARD_FALLBACK = "Failed to link card. Please try again.";

/** The server's card_number message when present (422 validation_failed), else the generic text. */
export const linkCardErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    const reason = error.fields?.card_number?.[0];
    if (reason) return `Failed to link card: ${reason}`;
  }
  return LINK_CARD_FALLBACK;
};
