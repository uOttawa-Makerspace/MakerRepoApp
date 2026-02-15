import React, { memo } from "react";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";

interface UnavailablePrinterCardProps {
  name: string;
}

const UnavailablePrinterCard = memo<UnavailablePrinterCardProps>(
  ({ name }) => (
    <Card sx={{ mb: 2, opacity: 0.6 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <PrintIcon color="disabled" />
          <Box flexGrow={1}>
            <Typography variant="h6" color="text.secondary">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently unavailable
            </Typography>
          </Box>
          <Chip label="Unavailable" size="small" />
        </Box>
      </CardContent>
    </Card>
  )
);

UnavailablePrinterCard.displayName = "UnavailablePrinterCard";
export default UnavailablePrinterCard;