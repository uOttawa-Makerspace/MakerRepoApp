export const INITIAL_FORM_DATA = {
  usernameEmail: "",
  password: "",
} as const;

export const VALIDATION = {
  usernameEmail: {
    required: "Email or username is required",
    minLength: { value: 3, message: "Must be at least 3 characters" },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
} as const;

export const ERROR_MESSAGES: Record<number | string, string> = {
  401: "Invalid username or password.",
  429: "Too many login attempts. Please try again later.",
  offline: "No internet connection. Please check your network.",
  default: "Something went wrong. Please try again later.",
};

export const EXTERNAL_LINKS = {
  forgotPassword: "https://makerepo.com/forgot_password",
  createAccount: "https://makerepo.com/new",
} as const;