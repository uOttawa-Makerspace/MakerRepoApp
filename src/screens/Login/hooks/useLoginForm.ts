import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { setUserSession } from "../../../utils/Common";
import { LoggedInContext } from "../../../utils/Contexts";
import * as HTTPRequest from "../../../utils/HTTPRequests";
import { FormData, FormErrors } from "../types";
import {
  INITIAL_FORM_DATA,
  VALIDATION,
  ERROR_MESSAGES,
} from "../constants";

export const useLoginForm = (setUser: (user: any) => void) => {
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

  const getErrorMessage = useCallback((error: any): string => {
    const status = error.response?.status;
    if (status && ERROR_MESSAGES[status]) {
      return ERROR_MESSAGES[status];
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
        const response = await HTTPRequest.post("login_authentication", {
          username_email: formData.usernameEmail,
          password: formData.password,
        });

        if (response.status === 200) {
          setUserSession(response.data.token, response.data.user);
          setUser(response.data.user);
          setLoggedIn(true);
          navigate("/");
        } else {
          setLoggedIn(false);
          setLoginError(
            "Invalid username or password. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Login error:", error);
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