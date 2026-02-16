export interface Printer {
  id: number;
  number: string;
  maintenance: boolean;
  has_issues: boolean;
}

export interface PrinterType {
  id: number;
  name: string;
  short_form: string;
  available: boolean;
  printers: Printer[];
}

export interface UserOption {
  id: string | number;
  name: string;
}

export interface PrinterOption {
  id: number;
  name: string;
  printer: Printer;
  printerType: PrinterType;
}

export interface PrinterStats {
  total: number;
  available: number;
  maintenance: number;
  issues: number;
}

export type PrinterStatus = "maintenance" | "issues" | "available";

export type PrintersProps = {
  inSpaceUsers: any;
  handleReloadCurrentUsers: () => void;
  reloadPrinters: () => void;
};