import { User } from "../types";

export interface ComplianceStatus {
  hasMembership: boolean;
  hasConsentForm: boolean;
  requiresShopFundamentals: boolean;
  requiresConsentForm: boolean;
  hasShopFundamentals: boolean;
  isCompliant: boolean;
  missingItems: string[];
}

export function getUserCompliance(
  user: User,
  spaceName?: string
): ComplianceStatus {
  const hasMembership = user.membership_status === true;
  const hasConsentForm = user.signed_safety_sheet === true;

  const isBrunsfield =
    spaceName?.toLowerCase().includes("brunsfield") ?? false;

  const hasShopFundamentals = isBrunsfield
    ? (user.certifications?.some((cert) =>
        cert.name.toLowerCase().includes("shop fundamentals")
      ) ?? false)
    : true;

  const missingItems: string[] = [];
  if (!hasMembership) missingItems.push("Active Membership");
  if (isBrunsfield && !hasConsentForm) missingItems.push("Consent Form");
  if (isBrunsfield && !hasShopFundamentals)
    missingItems.push("Shop Fundamentals");

  return {
    hasMembership,
    hasConsentForm,
    requiresShopFundamentals: isBrunsfield,
    requiresConsentForm: isBrunsfield,
    hasShopFundamentals,
    isCompliant: missingItems.length === 0,
    missingItems,
  };
}