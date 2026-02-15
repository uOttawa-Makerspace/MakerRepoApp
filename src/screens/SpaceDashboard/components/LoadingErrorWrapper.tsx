import React, { memo, ReactNode } from "react";
import { Box, Alert, CircularProgress } from "@mui/material";

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
}

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = memo(
  ({ loading, error, onRetry, children }) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" onClose={onRetry}>
          {error}
        </Alert>
      );
    }

    return <>{children}</>;
  }
);

LoadingErrorWrapper.displayName = "LoadingErrorWrapper";

export default LoadingErrorWrapper;