import { User } from "../types";

export interface ComplianceStatus {
  hasMembership: boolean;
  hasConsentForm: boolean;
  requiresShopFundamentals: boolean;
  hasShopFundamentals: boolean;
  isCompliant: boolean;
  missingItems: string[];
}

export function getUserCompliance(
  user: User,
  spaceName?: string
): ComplianceStatus {
  const hasMembership = user.active === true;
  const hasConsentForm = user.read_and_accepted_waiver_form === true;

  const isBrunsfield =
    spaceName?.toLowerCase().includes("brunsfield") ?? false;

  const hasShopFundamentals = isBrunsfield
    ? (user.certifications?.some((cert) =>
        cert.name.toLowerCase().includes("shop fundamentals")
      ) ?? false)
    : true;

  const missingItems: string[] = [];
  if (!hasMembership) missingItems.push("Active Membership");
  if (!hasConsentForm) missingItems.push("Consent Form");
  if (isBrunsfield && !hasShopFundamentals)
    missingItems.push("Shop Fundamentals");

  return {
    hasMembership,
    hasConsentForm,
    requiresShopFundamentals: isBrunsfield,
    hasShopFundamentals,
    isCompliant: missingItems.length === 0,
    missingItems,
  };
}