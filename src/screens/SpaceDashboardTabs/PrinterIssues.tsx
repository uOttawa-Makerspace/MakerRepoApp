import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Stack,
  TextField,
  InputAdornment,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Divider,
  TableSortLabel,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";

export type PrinterIssue = {
  id: number;
  printer_id: number;
  printer_name?: string;
  summary: string;
  description: string;
  reporter: string;
  created_at: string;
  resolved?: boolean;
  resolved_at?: string;
  resolved_by?: string;
};

type PrinterIssuesProps = {
  issues: PrinterIssue[];
  onIssueResolved?: () => void;
};

type SortField = "printer" | "summary" | "reporter" | "created_at";
type SortOrder = "asc" | "desc";

const PrinterIssues: React.FC<PrinterIssuesProps> = ({ issues, onIssueResolved }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showResolved, setShowResolved] = useState(false);
  const [resolveDialog, setResolveDialog] = useState<{
    open: boolean;
    issue: PrinterIssue | null;
  }>({ open: false, issue: null });
  const [resolving, setResolving] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<PrinterIssue | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleResolveClick = (issue: PrinterIssue) => {
    setResolveDialog({ open: true, issue });
    setAnchorEl(null);
  };

  const handleResolveConfirm = async () => {
    if (!resolveDialog.issue) return;

    setResolving(true);

    try {
      await HTTPRequest.post(`printer_issues/${resolveDialog.issue.id}/resolve`, {});
      
      toast.success("Issue marked as resolved", {
        position: "bottom-center",
        icon: "✅",
      });
      
      setResolveDialog({ open: false, issue: null });
      onIssueResolved?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve issue. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setResolving(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, issue: PrinterIssue) => {
    setAnchorEl(event.currentTarget);
    setSelectedIssue(issue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIssue(null);
  };

  // Filter and sort issues
  const filteredAndSortedIssues = useMemo(() => {
    let filtered = issues.filter((issue) => {
      const matchesSearch =
        (issue.printer_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.reporter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = showResolved ? issue.resolved : !issue.resolved;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "printer") {
        comparison = (a.printer_name || "").localeCompare(b.printer_name || "");
      } else if (sortField === "summary") {
        comparison = a.summary.localeCompare(b.summary);
      } else if (sortField === "reporter") {
        comparison = a.reporter.localeCompare(b.reporter);
      } else if (sortField === "created_at") {
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [issues, searchQuery, sortField, sortOrder, showResolved]);

  const stats = useMemo(() => {
    const openIssues = issues.filter((i) => !i.resolved).length;
    const resolvedIssues = issues.filter((i) => i.resolved).length;

    return { open: openIssues, resolved: resolvedIssues, total: issues.length };
  }, [issues]);

  // Mobile Issue Card
  const MobileIssueCard = ({ issue }: { issue: PrinterIssue }) => {
    const isExpanded = expandedIssue === issue.id;

    return (
      <Card
        sx={{
          mb: 2,
          border: 1,
          borderColor: issue.resolved ? "success.main" : "error.main",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  {issue.printer_name ? (
                    <Chip
                      icon={<PrintIcon />}
                      label={issue.printer_name}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      label="Unknown Printer"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  {issue.resolved ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Resolved"
                      size="small"
                      color="success"
                    />
                  ) : (
                    <Chip
                      icon={<ErrorIcon />}
                      label="Open"
                      size="small"
                      color="error"
                    />
                  )}
                </Stack>
                <Typography variant="subtitle1" fontWeight={600}>
                  {issue.summary}
                </Typography>
              </Box>
              {!issue.resolved && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, issue)}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            {/* Details */}
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {issue.reporter}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(issue.created_at)}
                </Typography>
              </Box>
            </Stack>

            {/* Expandable Description */}
            {issue.description && (
              <>
                <Button
                  size="small"
                  onClick={() =>
                    setExpandedIssue(isExpanded ? null : issue.id)
                  }
                  endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {isExpanded ? "Hide Details" : "Show Details"}
                </Button>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="body2" color="text.secondary">
                      {issue.description}
                    </Typography>
                  </Paper>
                </Collapse>
              </>
            )}

            {/* Resolve Button */}
            {!issue.resolved && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<DoneIcon />}
                onClick={() => handleResolveClick(issue)}
              >
                Mark as Resolved
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Desktop Table Row
  const DesktopIssueRow = ({ issue }: { issue: PrinterIssue }) => {
    const isExpanded = expandedIssue === issue.id;

    return (
      <>
        <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            {issue.description && (
              <IconButton
                size="small"
                onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </TableCell>
          <TableCell>
            {issue.printer_name ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <PrintIcon fontSize="small" color="action" />
                <Typography variant="body2">{issue.printer_name}</Typography>
              </Stack>
            ) : (
              <Chip label="Unknown" size="small" color="warning" />
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>
              {issue.summary}
            </Typography>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 28, height: 28, fontSize: "0.875rem" }}>
                {issue.reporter.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{issue.reporter}</Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {formatDate(issue.created_at)}
            </Typography>
          </TableCell>
          <TableCell>
            {issue.resolved ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Resolved"
                size="small"
                color="success"
              />
            ) : (
              <Chip icon={<ErrorIcon />} label="Open" size="small" color="error" />
            )}
          </TableCell>
          <TableCell align="right">
            {!issue.resolved && (
              <Tooltip title="More actions">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, issue)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
        {issue.description && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ py: 2, px: 6 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Description:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: "background.default" }}>
                    <Typography variant="body2" color="text.secondary">
                      {issue.description}
                    </Typography>
                  </Paper>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Box>
      {/* Stats */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
          <Typography variant="h4" fontWeight={700} color="error.main">
            {stats.open}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Open Issues
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
          <Typography variant="h4" fontWeight={700} color="success.main">
            {stats.resolved}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resolved
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Issues
          </Typography>
        </Paper>
      </Stack>

      {/* Search and Filters */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size={isMobile ? "medium" : "small"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          <Chip
            label={`Open (${stats.open})`}
            onClick={() => setShowResolved(false)}
            color={!showResolved ? "error" : "default"}
            variant={!showResolved ? "filled" : "outlined"}
            size="small"
          />
          <Chip
            label={`Resolved (${stats.resolved})`}
            onClick={() => setShowResolved(true)}
            color={showResolved ? "success" : "default"}
            variant={showResolved ? "filled" : "outlined"}
            size="small"
          />
        </Stack>
      </Stack>

      {/* Empty State */}
      {filteredAndSortedIssues.length === 0 ? (
        <Paper sx={{ p: isMobile ? 4 : 8, textAlign: "center", bgcolor: "background.default" }}>
          {showResolved ? (
            <CheckCircleIcon
              sx={{ fontSize: isMobile ? 48 : 64, color: "success.main", mb: 2 }}
            />
          ) : (
            <ErrorIcon
              sx={{ fontSize: isMobile ? 48 : 64, color: "text.secondary", mb: 2 }}
            />
          )}
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="text.secondary"
            gutterBottom
          >
            {searchQuery
              ? "No issues match your search"
              : showResolved
              ? "No resolved issues yet"
              : "No open issues"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery
              ? "Try a different search term"
              : showResolved
              ? "Great! All issues are still open"
              : "Great! No printer problems to report"}
          </Typography>
        </Paper>
      ) : isMobile ? (
        /* Mobile Card View */
        <Box>
          {filteredAndSortedIssues.map((issue) => (
            <MobileIssueCard key={issue.id} issue={issue} />
          ))}
        </Box>
      ) : (
        /* Desktop Table View */
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell>
                  <TableSortLabel
                    active={sortField === "printer"}
                    direction={sortField === "printer" ? sortOrder : "asc"}
                    onClick={() => handleSort("printer")}
                  >
                    Printer
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "summary"}
                    direction={sortField === "summary" ? sortOrder : "asc"}
                    onClick={() => handleSort("summary")}
                  >
                    Summary
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "reporter"}
                    direction={sortField === "reporter" ? sortOrder : "asc"}
                    onClick={() => handleSort("reporter")}
                  >
                    Reporter
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "created_at"}
                    direction={sortField === "created_at" ? sortOrder : "asc"}
                    onClick={() => handleSort("created_at")}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedIssues.map((issue) => (
                <DesktopIssueRow key={issue.id} issue={issue} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedIssue && handleResolveClick(selectedIssue)}>
          <ListItemIcon>
            <DoneIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Resolved</ListItemText>
        </MenuItem>
      </Menu>

      {/* Resolve Confirmation Dialog */}
      <Dialog
        open={resolveDialog.open}
        onClose={() => setResolveDialog({ open: false, issue: null })}
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
              Resolve Issue
            </Typography>
            <IconButton onClick={() => setResolveDialog({ open: false, issue: null })}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Resolve Issue</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Mark this issue as resolved?
            <br />
            <br />
            <strong>{resolveDialog.issue?.summary}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => setResolveDialog({ open: false, issue: null })}
            disabled={resolving}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResolveConfirm}
            color="success"
            variant="contained"
            disabled={resolving}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            {resolving ? "Resolving..." : "Mark as Resolved"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrinterIssues;