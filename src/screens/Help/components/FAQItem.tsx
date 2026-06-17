import React, { memo } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { FAQ } from "../types";

interface FAQItemProps {
  faq: FAQ;
}

const FAQItem: React.FC<FAQItemProps> = memo(({ faq }) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box 
        sx={{ p: 2 }} 
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {faq.question}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {faq.answer}
        </Typography>
      </Box>
    </Paper>
  );
});

FAQItem.displayName = "FAQItem";

export default FAQItem;