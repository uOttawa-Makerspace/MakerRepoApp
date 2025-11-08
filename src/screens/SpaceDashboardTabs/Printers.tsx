import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Print as PrintIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../../components/TabPanel";
import PrinterIssues, { PrinterIssue } from "./PrinterIssues";

// TypeScript Interfaces
interface Printer {
  id: number;
  number: string;
  maintenance: boolean;
  has_issues: boolean;
}

interface PrinterType {
  id: number;
  name: string;
  short_form: string;
  available: boolean;
  printers: Printer[];
}

interface User {
  id: string | number;
  name: string;
  email?: string;
}

interface PrinterOption {
  id: number;
  name: string;
  printer: Printer;
  printerType: PrinterType;
}

interface UserOption {
  id: string | number;
  name: string;
}

type PrintersProps = {
  inSpaceUsers: any;
  handleReloadCurrentUsers: () => void;
  reloadPrinters: () => void;
};

type PrinterLinkFormProps = {
  printerType: PrinterType;
  users: UserOption[];
  onLink: () => void;
};

const PrinterLinkForm: React.FC<PrinterLinkFormProps> = ({
  printerType,
  users,
  onLink,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedPrinter, setSelectedPrinter] = useState<PrinterOption | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [linking, setLinking] = useState(false);

  // Create printer options
  const printerOptions: PrinterOption[] = useMemo(() => {
    return printerType.printers
      .map((printer) => ({
        id: printer.id,
        name: `${printerType.short_form} - ${printer.number}`,
        printer,
        printerType,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [printerType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinter || !selectedUser) {
      toast.error("Please select both a printer and a user", {
        position: "bottom-center",
      });
      return;
    }
    setConfirmDialog(true);
  };

  const handleConfirmLink = async () => {
    if (!selectedPrinter || !selectedUser) return;

    setLinking(true);
    setConfirmDialog(false);

    try {
      await HTTPRequest.patch("printers/link_printer_to_user", {
        printer: {
          user_id: selectedUser.id,
          printer_id: selectedPrinter.id,
        },
      });

      toast.success(
        `${selectedUser.name} linked to ${selectedPrinter.name}`,
        {
          position: "bottom-center",
          icon: "🖨️",
          duration: 3000,
        }
      );

      // Reset form
      setSelectedPrinter(null);
      setSelectedUser(null);
      onLink();
    } catch (error) {
      console.error(error);
      toast.error("Failed to link printer. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setLinking(false);
    }
  };

  const getPrinterStatus = (printer: Printer) => {
    if (printer.maintenance) return "maintenance";
    if (printer.has_issues) return "issues";
    return "available";
  };

  const getStatusChip = (printer: Printer) => {
    const status = getPrinterStatus(printer);

    switch (status) {
      case "maintenance":
        return (
          <Chip
            icon={<BuildIcon />}
            label="Maintenance"
            color="warning"
            size="small"
          />
        );
      case "issues":
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Issues"
            color="error"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Available"
            color="success"
            size="small"
          />
        );
    }
  };

  if (!printerType.available) {
    return (
      <Card sx={{ mb: 2, opacity: 0.6 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <PrintIcon color="disabled" />
            <Box flexGrow={1}>
              <Typography variant="h6" color="text.secondary">
                {printerType.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently unavailable
              </Typography>
            </Box>
            <Chip label="Unavailable" size="small" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <PrintIcon color="primary" />
            <Typography variant="h6" fontWeight={600} flexGrow={1}>
              {printerType.name}
            </Typography>
            <Chip
              label={`${printerOptions.length} printer${printerOptions.length !== 1 ? "s" : ""}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Printer Selection */}
              <Autocomplete
                options={printerOptions}
                value={selectedPrinter}
                onChange={(e, newValue) => setSelectedPrinter(newValue)}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Typography variant="body2">{option.name}</Typography>
                      {getStatusChip(option.printer)}
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Printer"
                    placeholder="Choose a printer..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <PrintIcon sx={{ ml: 1, mr: -0.5, color: "action.active" }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* User Selection */}
              <Autocomplete
                options={users}
                value={selectedUser}
                onChange={(e, newValue) => setSelectedUser(newValue)}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {option.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{option.name}</Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    placeholder="Choose a user..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <PersonIcon sx={{ ml: 1, mr: -0.5, color: "action.active" }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={linking ? <CircularProgress size={20} /> : <LinkIcon />}
                disabled={!selectedPrinter || !selectedUser || linking}
                fullWidth={isMobile}
              >
                {linking ? "Linking..." : "Link Printer to User"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        {isMobile && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Confirm Link
            </Typography>
            <IconButton onClick={() => setConfirmDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm Printer Link</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Link <strong>{selectedPrinter?.name}</strong> to{" "}
            <strong>{selectedUser?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => setConfirmDialog(false)}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLink}
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            Confirm Link
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Printers: React.FC<PrintersProps> = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
  reloadPrinters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [printers, setPrinters] = useState<PrinterType[]>([]);
  const [printerIssues, setPrinterIssues] = useState<PrinterIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const fetchPrinters = async () => {
    setLoading(true);
    try {
      // Fetch printers
      const printerData = await HTTPRequest.get("printers/printer_data");
      
      if (printerData && Array.isArray(printerData)) {
        const formattedPrinters = printerData.map((pt: PrinterType) => ({
          id: pt.id,
          name: pt.name,
          short_form: pt.short_form,
          available: pt.available,
          printers: (pt.printers || []).map((p: Printer) => ({
            id: p.id,
            number: p.number,
            maintenance: p.maintenance,
            has_issues: p.has_issues,
          })),
        }));
        setPrinters(formattedPrinters);

        // Fetch printer issues
        const issuesData = await HTTPRequest.get("printer_issues");

        if (issuesData && issuesData.issues && Array.isArray(issuesData.issues)) {
          const formattedIssues = issuesData.issues.map((i: any) => {
            let printer_name = undefined;
            for (let pt of formattedPrinters) {
              let printer = pt.printers.find((p: Printer) => p.id == i.printer_id);
              if (printer) {
                printer_name = pt.short_form + " - " + printer.number;
                break;
              }
            }

            return {
              id: i.id,
              printer_id: i.printer_id,
              printer_name: printer_name,
              reporter: i.reporter,
              summary: i.summary,
              description: i.description,
              created_at: i.created_at,
            };
          });
          setPrinterIssues(formattedIssues);
        } else {
          console.warn("Invalid or missing issues data");
          setPrinterIssues([]);
        }
      } else {
        console.warn("Invalid or missing printer data");
        setPrinters([]);
        setPrinterIssues([]);
        toast.error("Failed to load printer data", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPrinters([]);
      setPrinterIssues([]);
      toast.error("Failed to load printer data", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchPrinters();
  }, [refreshTrigger]);

  // Internal reload function
  const handleReload = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Create user options
  const users: UserOption[] = useMemo(() => {
    if (!inSpaceUsers?.space_users) return [];
    return inSpaceUsers.space_users.map((u: any) => ({
      id: u.id,
      name: u.name,
    }));
  }, [inSpaceUsers]);

  // Stats
  const stats = useMemo(() => {
    const totalPrinters = printers.reduce((sum, pt) => sum + pt.printers.length, 0);
    const availablePrinters = printers.reduce(
      (sum, pt) =>
        sum + pt.printers.filter((p) => !p.maintenance && !p.has_issues).length,
      0
    );
    const maintenancePrinters = printers.reduce(
      (sum, pt) => sum + pt.printers.filter((p) => p.maintenance).length,
      0
    );
    const issueCount = printerIssues.length;

    return {
      total: totalPrinters,
      available: availablePrinters,
      maintenance: maintenancePrinters,
      issues: issueCount,
    };
  }, [printers, printerIssues]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      {!isMobile && (
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Printer Management
        </Typography>
      )}

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Printers
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} color="success.main">
            {stats.available}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} color="warning.main">
            {stats.maintenance}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maintenance
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} color="error.main">
            {stats.issues}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Issues
          </Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab
            label="Link Printers"
            icon={<LinkIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label={stats.issues > 0 ? `Issues (${stats.issues})` : "Issues"}
            icon={<WarningIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
        </Tabs>
      </Paper>

      {/* Link Printers Tab */}
      <TabPanel value={tabIndex} index={0}>
        {users.length === 0 ? (
          <Alert severity="info">
            No users signed in. Please sign in users before linking printers.
          </Alert>
        ) : printers.length === 0 ? (
          <Alert severity="warning">No printers available.</Alert>
        ) : (
          <Box>
            {printers.map((printerType) => (
              <PrinterLinkForm
                key={printerType.id}
                printerType={printerType}
                users={users}
                onLink={handleReload}
              />
            ))}
          </Box>
        )}
      </TabPanel>

      {/* Printer Issues Tab */}
      <TabPanel value={tabIndex} index={1}>
        <PrinterIssues issues={printerIssues} />
      </TabPanel>
    </Box>
  );
};

export default Printers;