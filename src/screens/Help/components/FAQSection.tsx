import React, { memo } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import { FAQS } from "../constants";
import FAQItem from "./FAQItem";

const FAQSection: React.FC = memo(() => {

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <InfoIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Frequently Asked Questions
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;