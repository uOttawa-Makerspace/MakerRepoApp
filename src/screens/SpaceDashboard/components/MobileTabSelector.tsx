import React, { memo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { TAB_CONFIG } from "../constants";

interface MobileTabSelectorProps {
  tabIndex: number;
  onTabChange: (index: number) => void;
}

const MobileTabSelector: React.FC<MobileTabSelectorProps> = memo(
  ({ tabIndex, onTabChange }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
      },
      []
    );

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleSelect = useCallback(
      (index: number) => {
        onTabChange(index);
        setAnchorEl(null);
      },
      [onTabChange]
    );

    const currentTab = TAB_CONFIG[tabIndex];

    return (
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowDownIcon />}
          onClick={handleOpen}
          sx={{
            justifyContent: "space-between",
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "primary.light",
              color: "white",
            },
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {currentTab.icon}
            {currentTab.label}
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: { width: "90vw", maxWidth: 400 },
          }}
        >
          {TAB_CONFIG.map((tab, index) => (
            <MenuItem
              key={index}
              selected={tabIndex === index}
              onClick={() => handleSelect(index)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{
                  fontWeight: tabIndex === index ? 600 : 400,
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }
);

MobileTabSelector.displayName = "MobileTabSelector";

export default MobileTabSelector;