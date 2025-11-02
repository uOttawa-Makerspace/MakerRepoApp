import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { setUserSession } from "../utils/Common";
import logo from "../assets/logo192.png";
import { LoggedInContext } from "../utils/Contexts";
import * as HTTPRequest from "../utils/HTTPRequests";

interface LoginProps {
  setUser: (user: any) => void;
}

interface FormErrors {
  usernameEmail?: string;
  password?: string;
}

function Login({ setUser }: LoginProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  // Form State
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UI State
  const [loginError, setLoginError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Prevent body scroll and remove navbar padding
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingBottom = document.body.style.paddingBottom;

    document.body.style.overflow = "hidden";
    document.body.style.paddingBottom = "0";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingBottom = originalPaddingBottom;
    };
  }, []);

  // Clear error when user starts typing
  useEffect(() => {
    if (loginError || formErrors.usernameEmail || formErrors.password) {
      setLoginError(null);
      setFormErrors({});
    }
  }, [usernameEmail, password]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!usernameEmail.trim()) {
      errors.usernameEmail = "Email or username is required";
    } else if (usernameEmail.trim().length < 3) {
      errors.usernameEmail = "Must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setLoginError(null);

    try {
      const response = await HTTPRequest.post("login_authentication", {
        username_email: usernameEmail,
        password,
      });

      if (response.status === 200) {
        setUserSession(response.data.token, response.data.user);
        setUser(response.data.user);
        setLoggedIn(true);
        navigate("/");
      } else {
        setLoggedIn(false);
        setLoginError("Invalid username or password. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoggedIn(false);
      
      if (error.response?.status === 401) {
        setLoginError("Invalid username or password.");
      } else if (error.response?.status === 429) {
        setLoginError("Too many login attempts. Please try again later.");
      } else if (!navigator.onLine) {
        setLoginError("No internet connection. Please check your network.");
      } else {
        setLoginError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        p: 2,
      }}
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          maxHeight: "95vh",
          overflow: "auto",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo and Header */}
          <Box textAlign="center" mb={4}>
            <Box
              component="img"
              src={logo}
              alt="MakeRepo Logo"
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                animation: "fadeIn 0.5s ease-in",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "scale(0.9)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
              }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to MakerRepo
            </Typography>
          </Box>

          {/* Error Alert */}
          {loginError && (
            <Alert
              severity="error"
              onClose={() => setLoginError(null)}
              sx={{ mb: 3 }}
            >
              {loginError}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              {/* Email/Username Field */}
              <TextField
                fullWidth
                label="Email or Username"
                type="text"
                value={usernameEmail}
                onChange={(e) => setUsernameEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                error={!!formErrors.usernameEmail}
                helperText={formErrors.usernameEmail}
                disabled={loading}
                autoComplete="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Forgot Password Link */}
              <Box textAlign="right">
                <Link
                  href="https://makerepo.com/forgot_password"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <LoginIcon />
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

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Sign Up Link */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Don't have an account?
            </Typography>
            <Button
              href="https://makerepo.com/new"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="medium"
              startIcon={<PersonAddIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Create Account
            </Button>
          </Paper>

          {/* Footer
          <Box textAlign="center" mt={3}>
            <Typography variant="caption" color="text.secondary">
              By signing in, you agree to our{" "}
              <Link
                href="https://makerepo.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://makerepo.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                Privacy Policy
              </Link>
            </Typography>
          </Box> */}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;