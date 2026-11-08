import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { signOutUser } from "../../../../api/endpoints";
import { errorMessage } from "../../../../api/client";
import { User, SignOutDialogState } from "../types";

export const useSignOut = (
  spaceId: number | string | undefined,
  onSuccess: () => void
) => {
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
    if (spaceId === undefined) {
      toast.error("No space selected", { position: "bottom-center" });
      return;
    }

    setSigningOut(true);
    const { username, name } = signOutDialog.user;

    try {
      await signOutUser(spaceId, username);
      onSuccess();
      toast.success(`${name} has been signed out`, {
        position: "bottom-center",
        icon: "👋",
      });
      setSignOutDialog({ open: false, user: null });
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to sign out user. Please try again."), {
        position: "bottom-center",
      });
    } finally {
      setSigningOut(false);
    }
  }, [signOutDialog.user, spaceId, onSuccess]);

  return {
    signOutDialog,
    signingOut,
    openSignOutDialog,
    closeSignOutDialog,
    confirmSignOut,
  };
};