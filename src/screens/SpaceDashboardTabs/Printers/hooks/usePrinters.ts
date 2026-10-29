import { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { listPrinterIssues, listPrinterTypes } from "../../../../api/endpoints";
import type { SpaceDashboardData } from "../../../../api/types";
import type { PrinterType, UserOption, PrinterStats, Printer } from "../types";
import type { PrinterIssue } from "../../PrinterIssues/types";

export function usePrinters(inSpaceUsers: SpaceDashboardData | null) {
  const [printers, setPrinters] = useState<PrinterType[]>([]);
  const [printerIssues, setPrinterIssues] = useState<PrinterIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
    },
    []
  );

  const handleReload = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchPrinters = useCallback(async () => {
    setLoading(true);
    try {
      const printerData = await listPrinterTypes();

      const formattedPrinters: PrinterType[] = printerData.map(
        (pt: PrinterType) => ({
          id: pt.id,
          name: pt.name,
          short_form: pt.short_form,
          available: pt.available,
          printers: (pt.printers || []).map((p: Printer) => ({
            id: p.id,
            number: p.number,
            maintenance: p.maintenance,
            has_issues: p.has_issues,
          })),
        })
      );

      setPrinters(formattedPrinters);

      // Build a printer ID → display name lookup for issues
      const printerNameMap = new Map<number, string>();
      for (const pt of formattedPrinters) {
        for (const p of pt.printers) {
          printerNameMap.set(p.id, `${pt.short_form} - ${p.number}`);
        }
      }

      try {
        const issuesData = await listPrinterIssues();

        setPrinterIssues(
          issuesData.map((i) => ({
            id: i.id,
            printer_id: i.printer_id,
            printer_name: printerNameMap.get(i.printer_id),
            reporter: i.reporter ?? "Unknown",
            summary: i.summary,
            description: i.description,
            created_at: i.created_at,
            active: i.active,
          }))
        );
      } catch (error) {
        console.warn("Failed to fetch printer issues:", error);
        setPrinterIssues([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPrinters([]);
      setPrinterIssues([]);
      toast.error("Failed to load printer data", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrinters();
  }, [fetchPrinters, refreshTrigger]);

  const users = useMemo<UserOption[]>(() => {
    if (!inSpaceUsers?.users) return [];
    return inSpaceUsers.users.map((u) => ({
      id: u.id,
      name: u.name,
    }));
  }, [inSpaceUsers]);

  const stats = useMemo<PrinterStats>(() => {
    let total = 0;
    let available = 0;
    let maintenance = 0;

    for (const pt of printers) {
      for (const p of pt.printers) {
        total++;
        if (p.maintenance) maintenance++;
        else if (!p.has_issues) available++;
      }
    }

    return {
      total,
      available,
      maintenance,
      issues: printerIssues.length,
    };
  }, [printers, printerIssues.length]);

  return {
    printers,
    printerIssues,
    loading,
    tabIndex,
    users,
    stats,
    handleTabChange,
    handleReload,
  };
}