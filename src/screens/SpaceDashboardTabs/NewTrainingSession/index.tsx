import React from "react";
import {
  Box,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTrainingSessionForm } from "./hooks/useTrainingSessionForm";
import TrainingDetailsCard from "./components/TrainingDetailsCard";
import TraineesCard from "./components/TraineesCard";
import ActionButtons from "./components/ActionButtons";
import ConfirmationDialog from "./components/ConfirmationDialog";
import type { NewTrainingSessionProps } from "./types";

const NewTrainingSession = ({
  spaceId,
  reloadTrainingSessions,
}: NewTrainingSessionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const form = useTrainingSessionForm(spaceId, reloadTrainingSessions);

  if (form.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!form.data) {
    return (
      <Alert severity="error">
        Failed to load training session data. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {!isMobile && (
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Create New Training Session
        </Typography>
      )}

      <Stack spacing={3}>
        <TrainingDetailsCard
          data={form.data}
          trainingId={form.trainingId}
          trainingLevel={form.trainingLevel}
          trainingCourse={form.trainingCourse}
          trainingInstructor={form.trainingInstructor}
          errors={form.errors}
          onTrainingChange={form.setTrainingId}
          onLevelChange={form.setTrainingLevel}
          onCourseChange={form.setTrainingCourse}
          onInstructorChange={form.setTrainingInstructor}
          clearFieldError={form.clearFieldError}
        />

        <TraineesCard
          filteredUsers={form.filteredUsers}
          selectedUsers={form.trainingUsers}
          selectedUsersData={form.selectedUsersData}
          searchQuery={form.searchQuery}
          error={form.errors.users}
          onSearchChange={form.setSearchQuery}
          onUserToggle={form.handleUserToggle}
          onSelectAll={form.handleSelectAll}
          onDeselectAll={form.handleDeselectAll}
        />

        <ActionButtons
          isMobile={isMobile}
          submitting={form.submitting}
          onReset={form.resetForm}
          onSubmit={form.handleSubmit}
        />
      </Stack>

      <ConfirmationDialog
        open={form.confirmDialog}
        isMobile={isMobile}
        trainingName={form.trainingName}
        trainingLevel={form.trainingLevel}
        trainingCourse={form.trainingCourse}
        instructorName={form.instructorName}
        traineeCount={form.trainingUsers.length}
        onClose={() => form.setConfirmDialog(false)}
        onConfirm={form.handleConfirmSubmit}
      />
    </Box>
  );
};

export default NewTrainingSession;