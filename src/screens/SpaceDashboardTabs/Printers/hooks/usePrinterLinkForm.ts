import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type { PrinterType, PrinterOption, UserOption } from "../types";

export function usePrinterLinkForm(
  printerType: PrinterType,
  onLink: () => void
) {
  const [selectedPrinter, setSelectedPrinter] =
    useState<PrinterOption | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [linking, setLinking] = useState(false);

  const printerOptions = useMemo<PrinterOption[]>(
    () =>
      printerType.printers
        .map((printer) => ({
          id: printer.id,
          name: `${printerType.short_form} - ${printer.number}`,
          printer,
          printerType,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [printerType]
  );

  const openConfirm = useCallback(() => {
    setConfirmDialog(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPrinter || !selectedUser) {
        toast.error("Please select both a printer and a user", {
          position: "bottom-center",
        });
        return;
      }
      openConfirm();
    },
    [selectedPrinter, selectedUser, openConfirm]
  );

  const handleConfirmLink = useCallback(async () => {
    if (!selectedPrinter || !selectedUser) return;

    setLinking(true);
    closeConfirm();

    try {
      await HTTPRequest.patch("printers/link_printer_to_user", {
        printer: {
          user_id: selectedUser.id,
          printer_id: selectedPrinter.id,
        },
      });

      toast.success(
        `${selectedUser.name} linked to ${selectedPrinter.name}`,
        { position: "bottom-center", icon: "🖨️", duration: 3000 }
      );

      setSelectedPrinter(null);
      setSelectedUser(null);
      onLink();
    } catch (error) {
      console.error(error);
      toast.error("Failed to link printer. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setLinking(false);
    }
  }, [selectedPrinter, selectedUser, closeConfirm, onLink]);

  const canSubmit = !!selectedPrinter && !!selectedUser && !linking;

  return {
    selectedPrinter,
    selectedUser,
    confirmDialog,
    linking,
    printerOptions,
    canSubmit,
    setSelectedPrinter,
    setSelectedUser,
    handleSubmit,
    handleConfirmLink,
    closeConfirm,
  };
}