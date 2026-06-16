import React, { memo, useCallback } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  Box,
  Link,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { FormData, FormErrors } from "../types";
import { EXTERNAL_LINKS } from "../constants";
import PasswordField from "./PasswordField";

interface LoginFormProps {
  formData: FormData;
  formErrors: FormErrors;
  loginError: string | null;
  loading: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onDismissError: () => void;
}

const LoginForm: React.FC<LoginFormProps> = memo(
  ({
    formData,
    formErrors,
    loginError,
    loading,
    onInputChange,
    onSubmit,
    onDismissError,
  }) => {
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          onSubmit();
        }
      },
      [onSubmit]
    );

    const handleUsernameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange("usernameEmail", e.target.value);
      },
      [onInputChange]
    );

    const handlePasswordChange = useCallback(
      (value: string) => {
        onInputChange("password", value);
      },
      [onInputChange]
    );

    return (
      <>
        {loginError && (
          <Alert
            severity="error"
            onClose={onDismissError}
            sx={{ mb: 3 }}
          >
            {loginError}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Email or Username"
              type="text"
              value={formData.usernameEmail}
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
              error={!!formErrors.usernameEmail}
              helperText={formErrors.usernameEmail}
              disabled={loading}
              autoComplete="username"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <PasswordField
              value={formData.password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              error={formErrors.password}
              disabled={loading}
            />

            <Box sx={{ textAlign: "right" }}>
              <Link
                href={EXTERNAL_LINKS.forgotPassword}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <LoginIcon />
                )
              }
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Stack>
        </form>
      </>
    );
  }
);

LoginForm.displayName = "LoginForm";

export default LoginForm;