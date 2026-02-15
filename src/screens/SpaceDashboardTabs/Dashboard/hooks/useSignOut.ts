import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import { User, SignOutDialogState } from "../types";

export const useSignOut = (onSuccess: () => void) => {
  const [signOutDialog, setSignOutDialog] = useState<SignOutDialogState>({
    open: false,
    user: null,
  });
  const [signingOut, setSigningOut] = useState(false);

  const openSignOutDialog = useCallback((user: User) => {
    setSignOutDialog({ open: true, user });
  }, []);

  const closeSignOutDialog = useCallback(() => {
    setSignOutDialog({ open: false, user: null });
  }, []);

  const confirmSignOut = useCallback(async () => {
    if (!signOutDialog.user) return;

    setSigningOut(true);
    const { username, name } = signOutDialog.user;

    try {
      await HTTPRequest.put(
        `staff_dashboard/remove_users?dropped_users[]=${username}`,
        {}
      );
      onSuccess();
      toast.success(`${name} has been signed out`, {
        position: "bottom-center",
        icon: "👋",
      });
      setSignOutDialog({ open: false, user: null });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out user. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSigningOut(false);
    }
  }, [signOutDialog.user, onSuccess]);

  return {
    signOutDialog,
    signingOut,
    openSignOutDialog,
    closeSignOutDialog,
    confirmSignOut,
  };
};