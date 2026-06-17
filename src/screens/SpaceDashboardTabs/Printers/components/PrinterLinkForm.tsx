import React, { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Print as PrintIcon,
  Person as PersonIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import PrinterStatusChip from "./PrinterStatusChip";
import UnavailablePrinterCard from "./UnavailablePrinterCard";
import LinkConfirmDialog from "./LinkConfirmDialog";
import { usePrinterLinkForm } from "../hooks/usePrinterLinkForm";
import type { PrinterType, PrinterOption, UserOption } from "../types";

// Extracted render functions to avoid inline arrow re-creation
const renderPrinterOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: PrinterOption
) => (
  <li {...props} key={option.id}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography variant="body2">{option.name}</Typography>
      <PrinterStatusChip printer={option.printer} />
    </Box>
  </li>
);

const renderUserOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: UserOption
) => (
  <li {...props} key={String(option.id)}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar sx={{ width: 32, height: 32 }}>
        {option.name.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="body2">{option.name}</Typography>
    </Box>
  </li>
);

const getPrinterOptionLabel = (option: PrinterOption) => option.name;
const getUserOptionLabel = (option: UserOption) => option.name;


const adornmentSx = { ml: 1, mr: -0.5, color: "action.active" } as const;

const renderPrinterInput = (params: any) => (
  <TextField
    {...params}
    label="Select Printer"
    placeholder="Choose a printer..."
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          <PrintIcon sx={adornmentSx} />
          {params.InputProps.startAdornment}
        </>
      ),
    }}
  />
);

const renderUserInput = (params: any) => (
  <TextField
    {...params}
    label="Select User"
    placeholder="Choose a user..."
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          <PersonIcon sx={adornmentSx} />
          {params.InputProps.startAdornment}
        </>
      ),
    }}
  />
);

// Props
interface PrinterLinkFormProps {
  printerType: PrinterType;
  users: UserOption[];
  onLink: () => void;
}

const PrinterLinkForm = memo<PrinterLinkFormProps>(
  ({ printerType, users, onLink }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {
      selectedPrinter,
      selectedUser,
      confirmDialog,
      linking,
      printerOptions,
      canSubmit,
      setSelectedPrinter,
      setSelectedUser,
      handleSubmit,
      handleConfirmLink,
      closeConfirm,
    } = usePrinterLinkForm(printerType, onLink);

    const handlePrinterChange = useCallback(
      (_e: any, value: PrinterOption | null) => setSelectedPrinter(value),
      [setSelectedPrinter]
    );

    const handleUserChange = useCallback(
      (_e: any, value: UserOption | null) => setSelectedUser(value),
      [setSelectedUser]
    );

    if (!printerType.available) {
      return <UnavailablePrinterCard name={printerType.name} />;
    }

    return (
      <>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <PrintIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                {printerType.name}
              </Typography>
              <Chip
                label={`${printerOptions.length} printer${
                  printerOptions.length !== 1 ? "s" : ""
                }`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Autocomplete
                  options={printerOptions}
                  value={selectedPrinter}
                  onChange={handlePrinterChange}
                  getOptionLabel={getPrinterOptionLabel}
                  renderOption={renderPrinterOption}
                  renderInput={renderPrinterInput}
                />

                <Autocomplete
                  options={users}
                  value={selectedUser}
                  onChange={handleUserChange}
                  getOptionLabel={getUserOptionLabel}
                  renderOption={renderUserOption}
                  renderInput={renderUserInput}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={
                    linking ? <CircularProgress size={20} /> : <LinkIcon />
                  }
                  disabled={!canSubmit}
                  fullWidth={isMobile}
                >
                  {linking ? "Linking..." : "Link Printer to User"}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        <LinkConfirmDialog
          open={confirmDialog}
          isMobile={isMobile}
          printerName={selectedPrinter?.name ?? ""}
          userName={selectedUser?.name ?? ""}
          onClose={closeConfirm}
          onConfirm={handleConfirmLink}
        />
      </>
    );
  }
);

PrinterLinkForm.displayName = "PrinterLinkForm";
export default PrinterLinkForm;