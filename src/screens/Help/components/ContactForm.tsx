import React, { memo } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { FormData, FormErrors } from "../types";
import { FORM_FIELDS } from "../constants";

interface ContactFormProps {
  formData: FormData;
  formErrors: FormErrors;
  submitting: boolean;
  submitSuccess: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDismissSuccess: () => void;
}

const SuccessAlert: React.FC<{ onClose: () => void }> = memo(
  ({ onClose }) => (
    <Alert
      severity="success"
      icon={<CheckCircleIcon />}
      onClose={onClose}
      sx={{ mb: 3 }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Message sent successfully!
      </Typography>
      <Typography variant="body2">
        We'll respond within 2 business days.
      </Typography>
    </Alert>
  )
);

SuccessAlert.displayName = "SuccessAlert";

const ContactForm: React.FC<ContactFormProps> = memo(
  ({
    formData,
    formErrors,
    submitting,
    submitSuccess,
    onInputChange,
    onSubmit,
    onDismissSuccess,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const getHelperText = (
      key: keyof FormData,
      defaultHelper?: string
    ): string | undefined => {
      if (formErrors[key]) return formErrors[key];
      if (key === "comments")
        return `${formData.comments.length} / 1000 characters`;
      return defaultHelper;
    };

    return (
      <>
        {submitSuccess && <SuccessAlert onClose={onDismissSuccess} />}

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Contact Support
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Can't find an answer? Send us a message and we'll get back to
              you within 2 business days.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={onSubmit}>
              <Stack spacing={3}>
                {FORM_FIELDS.map((field) => (
                  <TextField
                    key={field.key}
                    fullWidth
                    label={field.label}
                    type={field.type}
                    multiline={field.multiline}
                    rows={field.rows}
                    value={formData[field.key]}
                    onChange={(e) => onInputChange(field.key, e.target.value)}
                    error={!!formErrors[field.key]}
                    helperText={getHelperText(field.key, field.helperText)}
                    required
                    slotProps={{
                      input: {
                        startAdornment: field.icon,
                      },
                      ...(field.maxLength && {
                        htmlInput: { maxLength: field.maxLength },
                      }),
                    }}
                  />
                ))}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={
                    submitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  disabled={submitting}
                  fullWidth={isMobile}
                  sx={{
                    alignSelf: isMobile ? "stretch" : "flex-start",
                  }}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </>
    );
  }
);

ContactForm.displayName = "ContactForm";

export default ContactForm;