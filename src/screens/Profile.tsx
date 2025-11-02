import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CreditCard as CreditCardIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { replaceNoneWithNotAvailable } from "../helpers";
import { getUser } from "../utils/Common";
import * as HTTPRequest from "../utils/HTTPRequests";
import { TabPanel, a11yProps } from "../components/TabPanel";
import ChangeSpace from "../components/ChangeSpace";

// TypeScript Interfaces
type ProfileParams = {
  username: string;
};

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  faculty?: string;
  program?: string;
  year_of_study?: string;
  identity?: string;
  role: string;
  avatar_url?: string;
  rfid?: {
    card_number: string;
  } | null;
}

interface RfidInfo {
  cardNumber: string;
  tappedAt: string;
}

interface Certification {
  id: number;
  training: {
    id: number;
    name: string;
  };
  updated_at: string;
  created_at: string;
}

const Profile = () => {
  const { username } = useParams<ProfileParams>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [rfidList, setRfidList] = useState<RfidInfo[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [remainingTrainings, setRemainingTrainings] = useState<any[]>([]);
  const [inSpaceUsers, setInSpaceUsers] = useState<any>(null);

  // Form State
  const [role, setRole] = useState("");
  const [devProgram, setDevProgram] = useState(false);
  const [volunteerProgram, setVolunteerProgram] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editingPrograms, setEditingPrograms] = useState(false);

  // UI State
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlinkDialog, setUnlinkDialog] = useState<{
    open: boolean;
    cardNumber: string | null;
  }>({ open: false, cardNumber: null });

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    getProfile();
    getCurrentUsers();
  }, [username]);

  const getCurrentUsers = async () => {
    try {
      const response = await HTTPRequest.get("staff_dashboard");
      setInSpaceUsers(response);
      getUnsetRfids();
    } catch (error) {
      console.error(error);
    }
  };

  const getProfile = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const response = await HTTPRequest.get(username);
      setProfileUser(response.user);
      setPrograms(response.programs || []);
      setCertifications(response.certifications || []);
      setRemainingTrainings(response.remaining_trainings || []);
      setRole(response.user.role);

      setVolunteerProgram(response.programs.includes("Volunteer Program"));
      setDevProgram(response.programs.includes("Development Program"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const getUnsetRfids = async () => {
    try {
      const response = await HTTPRequest.get("rfid/get_unset_rfids");
      setRfidList(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkRfid = async (cardNumber: string) => {
    if (!profileUser) return;

    try {
      const response = await HTTPRequest.put("staff_dashboard/link_rfid", {
        card_number: cardNumber,
        user_id: profileUser.id,
      });

      if (response.status === "OK") {
        toast.success("RFID card linked successfully!", {
          position: "bottom-center",
          icon: "🎫",
        });
        getProfile();
        getUnsetRfids();
      } else {
        throw new Error("Link failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to link RFID card. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const handleUnlinkRfid = async () => {
    if (!unlinkDialog.cardNumber) return;

    try {
      const response = await HTTPRequest.put("staff_dashboard/unlink_rfid", {
        card_number: unlinkDialog.cardNumber,
      });

      if (response.status === "OK") {
        toast.success("RFID card unlinked successfully!", {
          position: "bottom-center",
        });
        getProfile();
        getUnsetRfids();
        setUnlinkDialog({ open: false, cardNumber: null });
      } else {
        throw new Error("Unlink failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlink RFID card. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const handleSaveRole = async () => {
    if (!profileUser) return;

    setSaving(true);
    try {
      await HTTPRequest.patch("admin/users/set_role", {
        id: profileUser.id,
        role,
      });

      toast.success("Role updated successfully!", {
        position: "bottom-center",
      });
      setEditingRole(false);
      getProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrograms = async () => {
    if (!profileUser) return;

    setSaving(true);
    try {
      await HTTPRequest.patch("change_programs", {
        user_id: profileUser.id,
        dev_program: devProgram,
        volunteer: volunteerProgram,
      });

      toast.success("Programs updated successfully!", {
        position: "bottom-center",
      });
      setEditingPrograms(false);
      getProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update programs. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "staff":
        return "warning";
      default:
        return "default";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <AdminIcon />;
      case "staff":
        return <WorkIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const isOwnProfile = currentUser?.username === profileUser?.username;

  if (loading || !profileUser || !currentUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          p: 3,
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={profileUser.avatar_url}
            sx={{ width: 80, height: 80, border: "4px solid white" }}
          >
            {profileUser.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700}>
              {profileUser.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              @{profileUser.username}
            </Typography>
          </Box>
          <Chip
            icon={getRoleIcon(profileUser.role)}
            label={profileUser.role.replace("_", " ").toUpperCase()}
            color={getRoleColor(profileUser.role)}
            sx={{
              fontWeight: 600,
              display: { xs: "none", sm: "flex" },
            }}
          />
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab
            label="About"
            icon={<PersonIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Programs"
            icon={<SchoolIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label={`Certifications (${certifications.length})`}
            icon={<BadgeIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          {isAdmin && (
            <Tab
              label="Role"
              icon={<AdminIcon />}
              iconPosition="start"
              {...a11yProps(3)}
            />
          )}
          <Tab
            label="RFID"
            icon={<CreditCardIcon />}
            iconPosition="start"
            {...a11yProps(isAdmin ? 4 : 3)}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        {/* About Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.username)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.email)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <SchoolIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Faculty
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.faculty)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <SchoolIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Program
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.program)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Year of Study
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.year_of_study)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Identity
                    </Typography>
                    <Typography variant="body1">
                      {replaceNoneWithNotAvailable(profileUser.identity)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Programs Tab */}
        <TabPanel value={tabIndex} index={1}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Program Enrollment
                </Typography>
                {isAdmin && (
                  <>
                    {!editingPrograms ? (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setEditingPrograms(true)}
                        size="small"
                      >
                        Edit
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setEditingPrograms(false);
                            setDevProgram(
                              programs.includes("Development Program")
                            );
                            setVolunteerProgram(
                              programs.includes("Volunteer Program")
                            );
                          }}
                          size="small"
                        >
                          Cancel
                        </Button>
                        <Button
                          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSavePrograms}
                          variant="contained"
                          size="small"
                          disabled={saving}
                        >
                          Save
                        </Button>
                      </Stack>
                    )}
                  </>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={devProgram}
                      onChange={(e) => setDevProgram(e.target.checked)}
                      disabled={!isAdmin || !editingPrograms}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Development Program
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Advanced maker development training
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={volunteerProgram}
                      onChange={(e) => setVolunteerProgram(e.target.checked)}
                      disabled={!isAdmin || !editingPrograms}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Volunteer Program
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Volunteer opportunities and benefits
                      </Typography>
                    </Box>
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Certifications Tab */}
        <TabPanel value={tabIndex} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Certifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {certifications.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <BadgeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography color="text.secondary">
                    No certifications yet
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {certifications.map((cert) => (
                    <Paper
                      key={cert.id}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2 }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "start", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: "success.main" }}>
                            <CheckCircleIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {cert.training.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Certified on {formatDate(cert.updated_at)}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label="Certified"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Role Manager Tab (Admin Only) */}
        {isAdmin && (
          <TabPanel value={tabIndex} index={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    User Role
                  </Typography>
                  {!editingRole ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditingRole(true)}
                      size="small"
                    >
                      Edit
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditingRole(false);
                          setRole(profileUser.role);
                        }}
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSaveRole}
                        variant="contained"
                        size="small"
                        disabled={saving}
                      >
                        Save
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Alert severity="info" sx={{ mb: 2 }}>
                  Current Role: <strong>{profileUser.role.replace("_", " ").toUpperCase()}</strong>
                </Alert>

                <FormControl component="fieldset" disabled={!editingRole}>
                  <RadioGroup
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <AdminIcon color="error" />
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              Admin
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Full system access and permissions
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="staff"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <WorkIcon color="warning" />
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              Staff
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Staff dashboard and training permissions
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="regular_user"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon />
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              Regular User
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Standard user access
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </TabPanel>
        )}

        {/* RFID Tab */}
        <TabPanel value={tabIndex} index={isAdmin ? 4 : 3}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                RFID Card
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {profileUser.rfid ? (
                <Box>
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    action={
                      isAdmin && (
                        <Button
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            setUnlinkDialog({
                              open: true,
                              cardNumber: profileUser.rfid?.card_number || "",
                            })
                          }
                        >
                          Remove
                        </Button>
                      )
                    }
                  >
                    <Typography variant="body2" fontWeight={600}>
                      RFID Card Linked
                    </Typography>
                    <Typography variant="caption">
                      Card Number: {profileUser.rfid.card_number}
                    </Typography>
                  </Alert>
                </Box>
              ) : (
                <Box>
                  <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
                    No RFID card linked to this account
                  </Alert>

                  {isAdmin && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <ChangeSpace
                          inSpaceUsers={inSpaceUsers}
                          handleReloadCurrentUsers={getCurrentUsers}
                        />
                      </Box>

                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Available RFID Cards
                      </Typography>
                      <Typography variant="caption" color="text.secondary" paragraph>
                        Tap a card in the selected space, then link it below
                      </Typography>

                      {rfidList.length === 0 ? (
                        <Alert severity="warning">
                          No unlinked cards detected. Please tap a card or select a different
                          space.
                        </Alert>
                      ) : (
                        <Stack spacing={1}>
                          {rfidList.map((rfid, index) => (
                            <Paper
                              key={index}
                              variant="outlined"
                              sx={{ p: 2, borderRadius: 2 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    Card: {rfid.cardNumber}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Tapped: {rfid.tappedAt}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleLinkRfid(rfid.cardNumber)}
                                >
                                  Link Card
                                </Button>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Unlink RFID Confirmation Dialog */}
      <Dialog
        open={unlinkDialog.open}
        onClose={() => setUnlinkDialog({ open: false, cardNumber: null })}
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
              Confirm Unlink
            </Typography>
            <IconButton
              onClick={() => setUnlinkDialog({ open: false, cardNumber: null })}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm RFID Unlink</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to unlink this RFID card from{" "}
            <strong>{profileUser.name}</strong>?
            <br />
            <br />
            Card: <strong>{unlinkDialog.cardNumber}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => setUnlinkDialog({ open: false, cardNumber: null })}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnlinkRfid}
            color="error"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            Unlink Card
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;