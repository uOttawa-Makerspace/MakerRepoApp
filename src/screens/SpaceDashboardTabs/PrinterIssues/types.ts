export type PrinterIssue = {
  id: number;
  printer_id: number;
  printer_name?: string;
  summary: string;
  description: string;
  reporter: string;
  created_at: string;
  active: boolean;
  resolved_at?: string;
  resolved_by?: string;
};

export type PrinterIssuesProps = {
  issues: PrinterIssue[];
  onIssueResolved?: () => void;
};

export type SortField = "printer" | "summary" | "reporter" | "created_at";
export type SortOrder = "asc" | "desc";

export interface IssueStats {
  open: number;
  resolved: number;
  total: number;
}