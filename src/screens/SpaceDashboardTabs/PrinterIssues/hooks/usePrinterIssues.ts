import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type { PrinterIssue, SortField, SortOrder, IssueStats } from "../types";

const SORT_COMPARATORS: Record<
  SortField,
  (a: PrinterIssue, b: PrinterIssue) => number
> = {
  printer: (a, b) =>
    (a.printer_name || "").localeCompare(b.printer_name || ""),
  summary: (a, b) => a.summary.localeCompare(b.summary),
  reporter: (a, b) => a.reporter.localeCompare(b.reporter),
  created_at: (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
};

export function usePrinterIssues(
  issues: PrinterIssue[],
  onIssueResolved?: () => void
) {
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showResolved, setShowResolved] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuIssue, setMenuIssue] = useState<PrinterIssue | null>(null);

  // Dialog state
  const [resolveDialog, setResolveDialog] = useState<{
    open: boolean;
    issue: PrinterIssue | null;
  }>({ open: false, issue: null });

  const toggleExpanded = useCallback((issueId: number) => {
    setExpandedIssue((prev) => (prev === issueId ? null : issueId));
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField]
  );

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, issue: PrinterIssue) => {
      setAnchorEl(event.currentTarget);
      setMenuIssue(issue);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setMenuIssue(null);
  }, []);

  const openResolveDialog = useCallback((issue: PrinterIssue) => {
    setResolveDialog({ open: true, issue });
    setAnchorEl(null);
    setMenuIssue(null);
  }, []);

  const closeResolveDialog = useCallback(() => {
    setResolveDialog({ open: false, issue: null });
  }, []);

  const handleResolveConfirm = useCallback(async () => {
    if (!resolveDialog.issue) return;

    setResolving(true);

    try {
      await HTTPRequest.post(
        `printer_issues/${resolveDialog.issue.id}/resolve`,
        {}
      );

      toast.success("Issue marked as resolved", {
        position: "bottom-center",
        icon: "✅",
      });

      closeResolveDialog();
      onIssueResolved?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve issue. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setResolving(false);
    }
  }, [resolveDialog.issue, closeResolveDialog, onIssueResolved]);

  // Derived data
  const filteredAndSortedIssues = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = issues.filter((issue) => {
      const matchesStatus = showResolved ? issue.resolved : !issue.resolved;
      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        (issue.printer_name?.toLowerCase() || "").includes(query) ||
        issue.summary.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.reporter.toLowerCase().includes(query)
      );
    });

    const comparator = SORT_COMPARATORS[sortField];
    const multiplier = sortOrder === "asc" ? 1 : -1;

    return filtered.sort((a, b) => comparator(a, b) * multiplier);
  }, [issues, searchQuery, sortField, sortOrder, showResolved]);

  const stats = useMemo<IssueStats>(() => {
    let open = 0;
    let resolved = 0;

    for (const issue of issues) {
      if (issue.resolved) resolved++;
      else open++;
    }

    return { open, resolved, total: issues.length };
  }, [issues]);

  return {
    // state
    searchQuery,
    expandedIssue,
    sortField,
    sortOrder,
    showResolved,
    resolving,
    anchorEl,
    menuIssue,
    resolveDialog,

    // derived
    filteredAndSortedIssues,
    stats,

    // actions
    setSearchQuery,
    setShowResolved,
    toggleExpanded,
    handleSort,
    handleMenuOpen,
    handleMenuClose,
    openResolveDialog,
    closeResolveDialog,
    handleResolveConfirm,
  };
}