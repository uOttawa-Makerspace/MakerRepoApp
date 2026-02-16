import React, { memo, useState, useCallback } from "react";
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <InfoIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Frequently Asked Questions
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              expanded={expandedIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;