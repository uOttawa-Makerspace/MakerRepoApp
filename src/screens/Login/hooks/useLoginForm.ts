import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../../../utils/Contexts";
import { login } from "../../../api/endpoints";
import { ApiError, errorMessage } from "../../../api/client";
import type { SessionUser } from "../../../api/types";
import { FormData, FormErrors } from "../types";
import {
  INITIAL_FORM_DATA,
  VALIDATION,
  ERROR_MESSAGES,
} from "../constants";

export const useLoginForm = (setUser: (user: SessionUser) => void) => {
  const { setLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear errors when user types
  useEffect(() => {
    if (loginError || formErrors.usernameEmail || formErrors.password) {
      setLoginError(null);
      setFormErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.usernameEmail, formData.password]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    const username = formData.usernameEmail.trim();
    if (!username) {
      errors.usernameEmail = VALIDATION.usernameEmail.required;
    } else if (username.length < VALIDATION.usernameEmail.minLength.value) {
      errors.usernameEmail = VALIDATION.usernameEmail.minLength.message;
    }

    if (!formData.password) {
      errors.password = VALIDATION.password.required;
    } else if (
      formData.password.length < VALIDATION.password.minLength.value
    ) {
      errors.password = VALIDATION.password.minLength.message;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof ApiError) {
      // Wrong password and unknown login look the same on purpose.
      if (error.status === 401) return ERROR_MESSAGES[401];
      if (error.status === 429) return ERROR_MESSAGES[429];
      if (error.status > 0 && error.status < 500) {
        // account_unconfirmed / account_inactive / account_locked / validation: the API says why.
        const message = errorMessage(error, ERROR_MESSAGES.default);
        const supportEmail = error.details.support_email;
        return typeof supportEmail === "string" && !message.includes(supportEmail)
          ? `${message} Contact ${supportEmail} for help.`
          : message;
      }
    }
    if (!navigator.onLine) {
      return ERROR_MESSAGES.offline;
    }
    return ERROR_MESSAGES.default;
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleLogin = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setLoginError(null);

      try {
        const user = await login(formData.usernameEmail, formData.password);
        setUser(user);
        setLoggedIn(true);
        navigate("/");
      } catch (error) {
        // Never log the request: it carries the password.
        console.error("Login failed:", error instanceof ApiError ? error.code : "network");
        setLoggedIn(false);
        setLoginError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      validateForm,
      getErrorMessage,
      setUser,
      setLoggedIn,
      navigate,
    ]
  );

  const dismissError = useCallback(() => setLoginError(null), []);

  return {
    formData,
    formErrors,
    loginError,
    loading,
    handleInputChange,
    handleLogin,
    dismissError,
  };
};