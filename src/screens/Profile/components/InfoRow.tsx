import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import { replaceNoneWithNotAvailable } from "../../../helpers";
import { InfoRowProps } from "../types";

const InfoRow: React.FC<InfoRowProps> = memo(({ icon, label, value }) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Box sx={{ color: "action.active", display: "flex" }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {replaceNoneWithNotAvailable(value)}
      </Typography>
    </Box>
  </Box>
));

InfoRow.displayName = "InfoRow";

export default InfoRow;