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
  Button,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  TableSortLabel,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";

// TypeScript Interfaces
interface Training {
  id: string | number;
  name: string;
}

interface Space {
  id: string | number;
  name: string;
}

interface TrainingSession {
  id: string | number;
  training: Training;
  space: Space;
  course: string;
  updated_at: string;
  created_at?: string;
  certifications: any[];
}

type TrainingSessionsProps = {
  trainingSessions: TrainingSession[] | null;
  reloadTrainingSessions: () => void;
};

type SortField = "date" | "training" | "space" | "course" | "status";
type SortOrder = "asc" | "desc";

const TrainingSessions = ({
  trainingSessions,
  reloadTrainingSessions,
}: TrainingSessionsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [certifyDialog, setCertifyDialog] = useState<{
    open: boolean;
    session: TrainingSession | null;
  }>({ open: false, session: null });
  const [certifying, setCertifying] = useState(false);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");

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

  const handleCertifyClick = (session: TrainingSession) => {
    setCertifyDialog({ open: true, session });
  };

  const handleCertifyConfirm = async () => {
    if (!certifyDialog.session) return;

    setCertifying(true);

    try {
      const response = await HTTPRequest.post(
        `staff/training_sessions/${certifyDialog.session.id}/certify_trainees`,
        {}
      );

      if (response.data.certified === true) {
        toast.success(
          `Successfully certified trainees for ${certifyDialog.session.training.name}!`,
          {
            position: "bottom-center",
            icon: "🎓",
            duration: 4000,
          }
        );
        reloadTrainingSessions();
        setCertifyDialog({ open: false, session: null });
      } else {
        toast.error(
          "Some users couldn't be certified. They may already have this certification.",
          {
            position: "bottom-center",
            duration: 5000,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to certify users. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setCertifying(false);
    }
  };

  const handleCertifyCancel = () => {
    setCertifyDialog({ open: false, session: null });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    if (!trainingSessions) return [];

    let filtered = trainingSessions.filter((session) => {
      const matchesSearch =
        session.training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.course.toLowerCase().includes(searchQuery.toLowerCase());

      const isCompleted = session.certifications.length > 0;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && isCompleted) ||
        (statusFilter === "pending" && !isCompleted);

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      } else if (sortField === "training") {
        comparison = a.training.name.localeCompare(b.training.name);
      } else if (sortField === "space") {
        comparison = a.space.name.localeCompare(b.space.name);
      } else if (sortField === "course") {
        comparison = a.course.localeCompare(b.course);
      } else if (sortField === "status") {
        const aComplete = a.certifications.length > 0 ? 1 : 0;
        const bComplete = b.certifications.length > 0 ? 1 : 0;
        comparison = aComplete - bComplete;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [trainingSessions, searchQuery, sortField, sortOrder, statusFilter]);

  const stats = useMemo(() => {
    if (!trainingSessions) return { total: 0, completed: 0, pending: 0 };
    
    const completed = trainingSessions.filter((s) => s.certifications.length > 0).length;
    
    return {
      total: trainingSessions.length,
      completed,
      pending: trainingSessions.length - completed,
    };
  }, [trainingSessions]);

  // Mobile Card Component
  const MobileSessionCard = ({ session }: { session: TrainingSession }) => {
    const isCompleted = session.certifications.length > 0;

    return (
      <Card
        sx={{
          mb: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                  {session.training.name}
                </Typography>
                <Chip
                  label={isCompleted ? "Completed" : "Pending"}
                  color={isCompleted ? "success" : "warning"}
                  size="small"
                  icon={isCompleted ? <CheckCircleIcon /> : <ScheduleIcon />}
                />
              </Box>
            </Box>

            <Divider />

            {/* Details */}
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(session.updated_at)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {session.space.name}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <SchoolIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {session.course}
                </Typography>
              </Box>
            </Stack>

            {/* Action Button */}
            {!isCompleted && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleCertifyClick(session)}
                startIcon={<CheckCircleIcon />}
                sx={{ mt: 1 }}
              >
                Certify Trainees
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (!trainingSessions) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {!isMobile && (
          <Typography variant="h5" fontWeight={600} gutterBottom>
            My Training Sessions
          </Typography>
        )}

        {/* Stats */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={`${stats.total} Total`}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
          <Chip
            label={`${stats.completed} Completed`}
            color="success"
            size={isMobile ? "small" : "medium"}
          />
          <Chip
            label={`${stats.pending} Pending`}
            color="warning"
            size={isMobile ? "small" : "medium"}
          />
        </Stack>

        {/* Search and Filters */}
        <Stack spacing={2}>
          <TextField
            placeholder="Search sessions..."
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

          {/* Status Filter */}
          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              onClick={() => setStatusFilter("all")}
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              size="small"
            />
            <Chip
              label="Completed"
              onClick={() => setStatusFilter("completed")}
              color={statusFilter === "completed" ? "success" : "default"}
              variant={statusFilter === "completed" ? "filled" : "outlined"}
              size="small"
            />
            <Chip
              label="Pending"
              onClick={() => setStatusFilter("pending")}
              color={statusFilter === "pending" ? "warning" : "default"}
              variant={statusFilter === "pending" ? "filled" : "outlined"}
              size="small"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Empty State */}
      {filteredAndSortedSessions.length === 0 ? (
        <Paper
          sx={{
            p: isMobile ? 4 : 8,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: isMobile ? 48 : 64,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="text.secondary"
            gutterBottom
          >
            {searchQuery || statusFilter !== "all"
              ? "No sessions match your filters"
              : "No training sessions yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Training sessions will appear here"}
          </Typography>
        </Paper>
      ) : isMobile ? (
        /* Mobile Card View */
        <Box sx={{ px: 0 }}>
          {filteredAndSortedSessions.map((session) => (
            <MobileSessionCard key={session.id} session={session} />
          ))}
        </Box>
      ) : (
        /* Desktop Table View */
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "date"}
                    direction={sortField === "date" ? sortOrder : "asc"}
                    onClick={() => handleSort("date")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "training"}
                    direction={sortField === "training" ? sortOrder : "asc"}
                    onClick={() => handleSort("training")}
                  >
                    Training
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "space"}
                    direction={sortField === "space" ? sortOrder : "asc"}
                    onClick={() => handleSort("space")}
                  >
                    Space
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "course"}
                    direction={sortField === "course" ? sortOrder : "asc"}
                    onClick={() => handleSort("course")}
                  >
                    Course
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "status"}
                    direction={sortField === "status" ? sortOrder : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedSessions.map((session) => {
                const isCompleted = session.certifications.length > 0;

                return (
                  <TableRow
                    key={session.id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(session.updated_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {session.training.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{session.space.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{session.course}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isCompleted ? "Completed" : "Pending"}
                        color={isCompleted ? "success" : "warning"}
                        size="small"
                        icon={isCompleted ? <CheckCircleIcon /> : <ScheduleIcon />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!isCompleted && (
                        <Tooltip title="Certify all trainees in this session">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleCertifyClick(session)}
                            startIcon={<CheckCircleIcon />}
                          >
                            Certify
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Certification Confirmation Dialog */}
      <Dialog
        open={certifyDialog.open}
        onClose={handleCertifyCancel}
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
              Certify Trainees
            </Typography>
            <IconButton onClick={handleCertifyCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Certify Trainees</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to certify all trainees in{" "}
            <strong>{certifyDialog.session?.training.name}</strong>?
            <br />
            <br />
            This will grant them the certification for this training.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={handleCertifyCancel}
            disabled={certifying}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCertifyConfirm}
            color="primary"
            variant="contained"
            disabled={certifying}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={certifying ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {certifying ? "Certifying..." : "Certify"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingSessions;