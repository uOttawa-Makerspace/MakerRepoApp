import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  Paper,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import EnvVariables from "../utils/EnvVariables";
import * as HTTPRequest from "../utils/HTTPRequests";
import { removeUserSession } from "../utils/Common";
import { LoggedInContext } from "../utils/Contexts";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  subject: string;
  comments: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  comments?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "How do I sign in to a space?",
    answer: "You can sign in using your RFID card at the entrance or through the staff dashboard.",
  },
  {
    question: "How do I get training on equipment?",
    answer: "Contact a staff member in the space or check the training sessions schedule in the app.",
  },
  {
    question: "What if a printer has an issue?",
    answer: "Report the issue through the Printers tab in the staff dashboard, or contact staff directly.",
  },
  {
    question: "How do I get certified?",
    answer: "Complete a training session and the instructor will certify you upon successful completion.",
  },
  {
    question: "Can I book equipment in advance?",
    answer: "Equipment booking policies vary by space. Please contact your local makerspace staff.",
  },
];

function Help() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { setLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    comments: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // UI State
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.comments.trim()) {
      errors.comments = "Message is required";
    } else if (formData.comments.trim().length < 10) {
      errors.comments = "Message must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "bottom-center",
      });
      return;
    }

    setSubmitting(true);

    try {
      await HTTPRequest.put("send_email", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        comments: formData.comments,
        app_version: `${EnvVariables.app_version} ${EnvVariables.app_release_type}`,
      });

      setSubmitSuccess(true);
      toast.success("Your message has been sent successfully!", {
        position: "bottom-center",
        icon: "✉️",
        duration: 4000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        comments: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to send your message. Please try again or email us directly at uottawa.makerepo@gmail.com",
        {
          position: "bottom-center",
          duration: 6000,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await HTTPRequest.get("logout");
      setLoggedIn(false);
      removeUserSession();
      toast.success("Logged out successfully", {
        position: "bottom-center",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setLoggingOut(false);
      setLogoutDialog(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3 }, pb: 10 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <HelpIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          MakerRepo v{EnvVariables.app_version} {EnvVariables.app_release_type}
        </Typography>
      </Paper>

      {/* Success Alert */}
      {submitSuccess && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          onClose={() => setSubmitSuccess(false)}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" fontWeight={600}>
            Message sent successfully!
          </Typography>
          <Typography variant="body2">
            We'll respond within 2 business days.
          </Typography>
        </Alert>
      )}

      {/* FAQ Section */}
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
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  onClick={() => toggleFAQ(index)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {faq.question}
                  </Typography>
                  <IconButton size="small">
                    {expandedFAQ === index ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={expandedFAQ === index}>
                  <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EmailIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Contact Support
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Can't find an answer? Send us a message and we'll get back to you within 2
            business days.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email || "We'll reply to this email"}
                required
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />

              {/* Subject Field */}
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
                required
                InputProps={{
                  startAdornment: (
                    <SubjectIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />

              {/* Comments Field */}
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={6}
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                error={!!formErrors.comments}
                helperText={
                  formErrors.comments ||
                  `${formData.comments.length} / 1000 characters`
                }
                required
                inputProps={{ maxLength: 1000 }}
                InputProps={{
                  startAdornment: (
                    <MessageIcon
                      sx={{
                        mr: 1,
                        color: "action.active",
                        alignSelf: "flex-start",
                        mt: 1.5,
                      }}
                    />
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                disabled={submitting}
                fullWidth={isMobile}
                sx={{ alignSelf: isMobile ? "stretch" : "flex-start" }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Direct Contact Info */}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Or email us directly at{" "}
          <Typography
            component="a"
            href="mailto:uottawa.makerepo@gmail.com"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            uottawa.makerepo@gmail.com
          </Typography>
        </Typography>
      </Paper>

      {/* Logout Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => setLogoutDialog(true)}
          size="large"
          fullWidth={isMobile}
        >
          Logout
        </Button>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
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
              Confirm Logout
            </Typography>
            <IconButton onClick={() => setLogoutDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm Logout</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to logout from MakerRepo?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => setLogoutDialog(false)}
            disabled={loggingOut}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            disabled={loggingOut}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={loggingOut ? <CircularProgress size={20} /> : <LogoutIcon />}
          >
            {loggingOut ? "Logging Out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Help;