import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Checkbox,
  useMediaQuery,
  useTheme,
  Collapse,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/Common";

// TypeScript Interfaces
interface Training {
  id: string | number;
  name: string;
}

interface Admin {
  id: string | number;
  name: string;
  email?: string;
}

interface User {
  id: string | number;
  name: string;
  email?: string;
  username?: string;
}

interface NewTrainingSessionData {
  trainings: [string | number, string][];
  level: string[];
  course_names: string[];
  admins: [string | number, string][];
  users: [string | number, string][];
}

type NewTrainingSessionProps = {
  spaceId: number | string | null;
  reloadTrainingSessions: () => void;
};

const NewTrainingSession = ({
  spaceId,
  reloadTrainingSessions,
}: NewTrainingSessionProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get current user
  const currentUser = getUser();

  // Form State
  const [data, setData] = useState<NewTrainingSessionData | null>(null);
  const [trainingId, setTrainingId] = useState<string>("");
  const [trainingLevel, setTrainingLevel] = useState<string>("");
  const [trainingCourse, setTrainingCourse] = useState<string>("");
  const [trainingInstructor, setTrainingInstructor] = useState<string>("");
  const [trainingUsers, setTrainingUsers] = useState<string[]>([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<{
    training?: string;
    level?: string;
    course?: string;
    instructor?: string;
    users?: string;
  }>({});

  useEffect(() => {
    getNewTrainingSession();
  }, []);

  const getNewTrainingSession = async () => {
    setLoading(true);
    try {
      const response = await HTTPRequest.get("staff/training_sessions/new");
      setData(response);

      // Set default values
      if (response.trainings?.length > 0) {
        setTrainingId(String(response.trainings[0][0]));
      }
      if (response.level?.length > 0) {
        setTrainingLevel(response.level[0]);
      }
      if (response.course_names?.length > 0) {
        setTrainingCourse(response.course_names[0]);
      }
      
      // Set instructor to current user if they're in the admins list
      if (response.admins?.length > 0 && currentUser?.id) {
        const currentUserId = String(currentUser.id);
        const isInAdminsList = response.admins.some(
          (admin: any[]) => String(admin[0]) === currentUserId
        );
        
        // Set current user as instructor if they're in the list, otherwise use first admin
        setTrainingInstructor(
          isInAdminsList ? currentUserId : String(response.admins[0][0])
        );
      } else if (response.admins?.length > 0) {
        setTrainingInstructor(String(response.admins[0][0]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load training session data", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setTrainingUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setErrors((prev) => ({ ...prev, users: undefined }));
  };

  const handleSelectAll = () => {
    if (!data?.users) return;
    const allUserIds = data.users.map((u) => String(u[0]));
    setTrainingUsers(allUserIds);
    setErrors((prev) => ({ ...prev, users: undefined }));
  };

  const handleDeselectAll = () => {
    setTrainingUsers([]);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!trainingId) newErrors.training = "Please select a training";
    if (!trainingLevel) newErrors.level = "Please select a level";
    if (!trainingCourse) newErrors.course = "Please select a course";
    if (!trainingInstructor) newErrors.instructor = "Please select an instructor";
    if (trainingUsers.length === 0)
      newErrors.users = "Please select at least one user";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields", {
        position: "bottom-center",
      });
      return;
    }
    setConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (spaceId === null) {
      toast.error("No space selected", { position: "bottom-center" });
      return;
    }

    setSubmitting(true);
    setConfirmDialog(false);

    try {
      const response = await HTTPRequest.post("staff/training_sessions", {
        training_session: {
          space_id: spaceId,
        },
        training_id: trainingId,
        level: trainingLevel,
        course: trainingCourse,
        user_id: trainingInstructor,
        training_session_users: trainingUsers,
      });

      if (response.data.created === true) {
        toast.success(
          `Training session created with ${trainingUsers.length} trainee${
            trainingUsers.length !== 1 ? "s" : ""
          }!`,
          {
            position: "bottom-center",
            icon: "🎓",
            duration: 4000,
          }
        );
        reloadTrainingSessions();
        resetForm();
        // navigate("/staff/training_sessions"); // Uncomment if you want to navigate away
      } else {
        toast.error("Error creating training session!", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create training session. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTrainingUsers([]);
    setSearchQuery("");
    setErrors({});
    if (data) {
      setTrainingId(data.trainings[0]?.[0] ? String(data.trainings[0][0]) : "");
      setTrainingLevel(data.level[0] || "");
      setTrainingCourse(data.course_names[0] || "");
      
      // Reset instructor to current user if they're in the admins list
      if (data.admins?.length > 0 && currentUser?.id) {
        const currentUserId = String(currentUser.id);
        const isInAdminsList = data.admins.some(
          (admin) => String(admin[0]) === currentUserId
        );
        
        setTrainingInstructor(
          isInAdminsList ? currentUserId : String(data.admins[0][0])
        );
      } else if (data.admins?.length > 0) {
        setTrainingInstructor(String(data.admins[0][0]));
      }
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    if (!searchQuery) return data.users;

    return data.users.filter((user) =>
      user[1].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.users, searchQuery]);

  const selectedUsersData = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((user) => trainingUsers.includes(String(user[0])));
  }, [data?.users, trainingUsers]);

  const getTrainingName = () => {
    return data?.trainings.find((t) => String(t[0]) === trainingId)?.[1] || "";
  };

  const getInstructorName = () => {
    return data?.admins.find((a) => String(a[0]) === trainingInstructor)?.[1] || "";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Alert severity="error">
        Failed to load training session data. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      {!isMobile && (
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Create New Training Session
        </Typography>
      )}

      <Stack spacing={3}>
        {/* Training Details Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Training Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2.5}>
              {/* Training Selection */}
              <FormControl fullWidth error={!!errors.training}>
                <InputLabel>Training *</InputLabel>
                <Select
                  value={trainingId}
                  onChange={(e) => {
                    setTrainingId(e.target.value);
                    setErrors((prev) => ({ ...prev, training: undefined }));
                  }}
                  label="Training *"
                >
                  {data.trainings.map((training) => (
                    <MenuItem key={training[0]} value={String(training[0])}>
                      {training[1]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.training && (
                  <FormHelperText>{errors.training}</FormHelperText>
                )}
              </FormControl>

              {/* Level Selection */}
              <FormControl fullWidth error={!!errors.level}>
                <InputLabel>Level *</InputLabel>
                <Select
                  value={trainingLevel}
                  onChange={(e) => {
                    setTrainingLevel(e.target.value);
                    setErrors((prev) => ({ ...prev, level: undefined }));
                  }}
                  label="Level *"
                >
                  {data.level.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
                {errors.level && <FormHelperText>{errors.level}</FormHelperText>}
              </FormControl>

              {/* Course Selection */}
              <FormControl fullWidth error={!!errors.course}>
                <InputLabel>Course *</InputLabel>
                <Select
                  value={trainingCourse}
                  onChange={(e) => {
                    setTrainingCourse(e.target.value);
                    setErrors((prev) => ({ ...prev, course: undefined }));
                  }}
                  label="Course *"
                >
                  {data.course_names.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
                {errors.course && <FormHelperText>{errors.course}</FormHelperText>}
              </FormControl>

              {/* Instructor Selection */}
              <FormControl fullWidth error={!!errors.instructor}>
                <InputLabel>Instructor *</InputLabel>
                <Select
                  value={trainingInstructor}
                  onChange={(e) => {
                    setTrainingInstructor(e.target.value);
                    setErrors((prev) => ({ ...prev, instructor: undefined }));
                  }}
                  label="Instructor *"
                >
                  {data.admins.map((admin) => (
                    <MenuItem key={admin[0]} value={String(admin[0])}>
                      {admin[1]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.instructor && (
                  <FormHelperText>{errors.instructor}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Trainees Selection Card */}
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight={600}>
                  Trainees
                </Typography>
                <Chip
                  label={`${trainingUsers.length} selected`}
                  color={trainingUsers.length > 0 ? "primary" : "default"}
                  size="small"
                />
              </Box>
              <IconButton
                onClick={() => setShowUserList(!showUserList)}
                size="small"
              >
                {showUserList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            {errors.users && <Alert severity="error" sx={{ mb: 2 }}>{errors.users}</Alert>}

            <Collapse in={showUserList}>
              <Stack spacing={2}>
                {/* Search and Actions */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    placeholder="Search trainees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
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
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSelectAll}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleDeselectAll}
                      disabled={trainingUsers.length === 0}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Stack>

                {/* User List */}
                <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
                  {filteredUsers.length === 0 ? (
                    <Box p={4} textAlign="center">
                      <PersonIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                      />
                      <Typography color="text.secondary">
                        {searchQuery
                          ? "No users match your search"
                          : "No users available"}
                      </Typography>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {filteredUsers.map((user, index) => {
                        const userId = String(user[0]);
                        const isSelected = trainingUsers.includes(userId);

                        return (
                          <React.Fragment key={userId}>
                            <ListItem disablePadding>
                              <ListItemButton
                                onClick={() => handleUserToggle(userId)}
                                dense
                              >
                                <Checkbox
                                  edge="start"
                                  checked={isSelected}
                                  tabIndex={-1}
                                  disableRipple
                                />
                                <ListItemText
                                  primary={user[1]}
                                  primaryTypographyProps={{
                                    fontWeight: isSelected ? 600 : 400,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                            {index < filteredUsers.length - 1 && <Divider />}
                          </React.Fragment>
                        );
                      })}
                    </List>
                  )}
                </Paper>
              </Stack>
            </Collapse>

            {/* Selected Users Summary */}
            {trainingUsers.length > 0 && !showUserList && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected trainees:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                  {selectedUsersData.slice(0, 5).map((user) => (
                    <Chip
                      key={user[0]}
                      label={user[1]}
                      size="small"
                      onDelete={() => handleUserToggle(String(user[0]))}
                    />
                  ))}
                  {selectedUsersData.length > 5 && (
                    <Chip
                      label={`+${selectedUsersData.length - 5} more`}
                      size="small"
                      variant="outlined"
                      onClick={() => setShowUserList(true)}
                    />
                  )}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            onClick={resetForm}
            disabled={submitting}
            fullWidth={isMobile}
            size="large"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            fullWidth={isMobile}
            size="large"
            startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {submitting ? "Creating..." : "Create Training Session"}
          </Button>
        </Stack>
      </Stack>

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
              Confirm Training Session
            </Typography>
            <IconButton onClick={() => setConfirmDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm Training Session</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Please review the details before creating:
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Training
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {getTrainingName()}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Level & Course
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trainingLevel} - {trainingCourse}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Instructor
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {getInstructorName()}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trainees
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trainingUsers.length} user{trainingUsers.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
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
            onClick={handleConfirmSubmit}
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            Create Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewTrainingSession;