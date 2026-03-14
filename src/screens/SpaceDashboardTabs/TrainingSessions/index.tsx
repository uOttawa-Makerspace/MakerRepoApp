import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { TrainingSession } from "./types";
import { useTrainingSessions } from "./hooks/useTrainingSessions";
import SessionStats from "./components/SessionStats";
import SearchAndFilters from "./components/SearchAndFilters";
import EmptyState from "./components/EmptyState";
import SessionResults from "./components/SessionResults";
import CertifyDialog from "./components/CertifyDialog";
import UsersDialog from "./components/UsersDialog";

interface TrainingSessionsProps {
  trainingSessions: TrainingSession[] | null;
  reloadTrainingSessions: () => void;
}

const TrainingSessions = ({
  trainingSessions,
  reloadTrainingSessions,
}: TrainingSessionsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    statusFilter,
    setStatusFilter,
    sortField,
    sortOrder,
    handleSort,
    certifyDialog,
    certifying,
    openCertifyDialog,
    closeCertifyDialog,
    confirmCertify,
    usersDialog,
    openUsersDialog,
    closeUsersDialog,
    filteredAndSortedSessions,
    stats,
  } = useTrainingSessions(trainingSessions, reloadTrainingSessions);

  if (!trainingSessions) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const hasActiveFilters = !!searchQuery || statusFilter !== "all";
  const hasResults = filteredAndSortedSessions.length > 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {!isMobile && (
          <Typography variant="h5" fontWeight={600} gutterBottom>
            My Training Sessions
          </Typography>
        )}

        <SessionStats stats={stats} isMobile={isMobile} />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={clearSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          isMobile={isMobile}
        />
      </Box>

      {/* Content */}
      {hasResults ? (
        <SessionResults
          sessions={filteredAndSortedSessions}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onCertifyClick={openCertifyDialog}
          onSessionClick={openUsersDialog}
        />
      ) : (
        <EmptyState hasActiveFilters={hasActiveFilters} isMobile={isMobile} />
      )}

      {/* Certify Dialog */}
      <CertifyDialog
        open={certifyDialog.open}
        session={certifyDialog.session}
        loading={certifying}
        onConfirm={confirmCertify}
        onCancel={closeCertifyDialog}
      />

      {/* Users Dialog */}
      <UsersDialog
        open={usersDialog.open}
        session={usersDialog.session}
        onClose={closeUsersDialog}
      />
    </Box>
  );
};

export default TrainingSessions;