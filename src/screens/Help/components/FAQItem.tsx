import React, { memo, useCallback } from "react";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { FAQ } from "../types";

interface FAQItemProps {
  faq: FAQ;
  index: number;
  expanded: boolean;
  onToggle: (index: number) => void;
}

const FAQItem: React.FC<FAQItemProps> = memo(
  ({ faq, index, expanded, onToggle }) => {
    const handleClick = useCallback(() => onToggle(index), [onToggle, index]);

    return (
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          onClick={handleClick}
          sx={{
            p: 2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {faq.question}
          </Typography>
          <IconButton size="small" tabIndex={-1}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded}>
          <Box sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    );
  }
);

FAQItem.displayName = "FAQItem";

export default FAQItem;