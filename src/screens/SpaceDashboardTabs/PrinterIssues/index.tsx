import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { usePrinterIssues } from "./hooks/usePrinterIssues";
import StatsBar from "./components/StatsBar";
import SearchAndFilters from "./components/SearchAndFilters";
import EmptyState from "./components/EmptyState";
import MobileIssueCard from "./components/MobileIssueCard";
import DesktopIssueTable from "./components/DesktopIssueTable";
import IssueActionsMenu from "./components/IssueActionsMenu";
import ResolveDialog from "./components/ResolveDialog";
import type { PrinterIssuesProps } from "./types";

const PrinterIssues: React.FC<PrinterIssuesProps> = ({
  issues,
  onIssueResolved,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    searchQuery,
    expandedIssue,
    sortField,
    sortOrder,
    showResolved,
    resolving,
    anchorEl,
    menuIssue,
    resolveDialog,
    filteredAndSortedIssues,
    stats,
    setSearchQuery,
    setShowResolved,
    toggleExpanded,
    handleSort,
    handleMenuOpen,
    handleMenuClose,
    openResolveDialog,
    closeResolveDialog,
    handleResolveConfirm,
  } = usePrinterIssues(issues, onIssueResolved);

  return (
    <Box>
      <StatsBar stats={stats} />

      <SearchAndFilters
        searchQuery={searchQuery}
        showResolved={showResolved}
        stats={stats}
        isMobile={isMobile}
        onSearchChange={setSearchQuery}
        onToggleResolved={setShowResolved}
      />

      {filteredAndSortedIssues.length === 0 ? (
        <EmptyState
          showResolved={showResolved}
          hasSearch={!!searchQuery}
          isMobile={isMobile}
        />
      ) : isMobile ? (
        <Box>
          {filteredAndSortedIssues.map((issue) => (
            <MobileIssueCard
              key={issue.id}
              issue={issue}
              isExpanded={expandedIssue === issue.id}
              onToggleExpand={toggleExpanded}
              onMenuOpen={handleMenuOpen}
              onResolve={openResolveDialog}
            />
          ))}
        </Box>
      ) : (
        <DesktopIssueTable
          issues={filteredAndSortedIssues}
          expandedIssue={expandedIssue}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onToggleExpand={toggleExpanded}
          onMenuOpen={handleMenuOpen}
        />
      )}

      <IssueActionsMenu
        anchorEl={anchorEl}
        issue={menuIssue}
        onClose={handleMenuClose}
        onResolve={openResolveDialog}
      />

      <ResolveDialog
        open={resolveDialog.open}
        issue={resolveDialog.issue}
        isMobile={isMobile}
        resolving={resolving}
        onClose={closeResolveDialog}
        onConfirm={handleResolveConfirm}
      />
    </Box>
  );
};

export default PrinterIssues;