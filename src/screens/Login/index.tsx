import React from "react";

import { LoginProps } from "./types";
import { useLoginForm } from "./hooks/useLoginForm";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";

import LoginContainer from "./components/LoginContainer";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import SignUpSection from "./components/SignUpSection";

const Login: React.FC<LoginProps> = ({ setUser }) => {
  useBodyScrollLock();

  const {
    formData,
    formErrors,
    loginError,
    loading,
    handleInputChange,
    handleLogin,
    dismissError,
  } = useLoginForm(setUser);

  return (
    <LoginContainer>
      <LoginHeader />

      <LoginForm
        formData={formData}
        formErrors={formErrors}
        loginError={loginError}
        loading={loading}
        onInputChange={handleInputChange}
        onSubmit={handleLogin}
        onDismissError={dismissError}
      />

      <SignUpSection />
    </LoginContainer>
  );
};

export default Login;