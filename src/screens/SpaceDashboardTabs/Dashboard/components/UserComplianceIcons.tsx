import React, { memo } from "react";
import { Stack, Tooltip } from "@mui/material";
import {
  CardMembership as MembershipIcon,
  Description as ConsentIcon,
  Construction as TrainingIcon,
} from "@mui/icons-material";
import { ComplianceStatus } from "../utils/userCompliance";

interface UserComplianceIconsProps {
  compliance: ComplianceStatus;
}

const UserComplianceIcons: React.FC<UserComplianceIconsProps> = memo(
  ({ compliance }) => {
    const {
      hasMembership,
      hasConsentForm,
      requiresShopFundamentals,
      hasShopFundamentals,
    } = compliance;

    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip
          title={
            hasMembership
              ? "Active Membership ✓"
              : "⚠ Missing: Active Membership"
          }
          arrow
        >
          <MembershipIcon
            fontSize="small"
            sx={{
              color: hasMembership ? "success.main" : "error.main",
              cursor: "help",
            }}
          />
        </Tooltip>

        <Tooltip
          title={
            hasConsentForm
              ? "Consent Form Signed ✓"
              : "⚠ Missing: Consent Form"
          }
          arrow
        >
          <ConsentIcon
            fontSize="small"
            sx={{
              color: hasConsentForm ? "success.main" : "error.main",
              cursor: "help",
            }}
          />
        </Tooltip>

        {requiresShopFundamentals && (
          <Tooltip
            title={
              hasShopFundamentals
                ? "Shop Fundamentals ✓"
                : "⚠ Missing: Shop Fundamentals Certification"
            }
            arrow
          >
            <TrainingIcon
              fontSize="small"
              sx={{
                color: hasShopFundamentals
                  ? "success.main"
                  : "error.main",
                cursor: "help",
              }}
            />
          </Tooltip>
        )}
      </Stack>
    );
  }
);

UserComplianceIcons.displayName = "UserComplianceIcons";

export default UserComplianceIcons;