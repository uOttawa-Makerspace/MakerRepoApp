import React from "react";
import { EventNote, AccessTime } from "@mui/icons-material";

export const LoadingOverlay = React.memo(() => (
  <div className="loading-overlay">
    <div className="spinner" />
    <p>Loading shifts...</p>
  </div>
));
LoadingOverlay.displayName = "LoadingOverlay";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = React.memo(({ message, onRetry }: ErrorStateProps) => (
  <div className="error-state">
    <EventNote className="error-icon" />
    <p className="error-message">{message}</p>
    <button className="retry-btn" onClick={onRetry}>
      Try Again
    </button>
  </div>
));
ErrorState.displayName = "ErrorState";

export const EmptyState = React.memo(() => (
  <div className="empty-state">
    <AccessTime className="empty-icon" />
    <h3>No Shifts Scheduled</h3>
    <p>You don't have any shifts scheduled at the moment.</p>
  </div>
));
EmptyState.displayName = "EmptyState";