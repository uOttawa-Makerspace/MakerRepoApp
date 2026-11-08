import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { signInUser } from "../../../../api/endpoints";
import { errorMessage } from "../../../../api/client";
import type { SearchUser } from "../types";

export interface SignInDialogState {
  open: boolean;
  user: SearchUser | null;
}

export const useSignIn = (
  spaceId: number | string | undefined,
  onSuccess: () => void
) => {
  const [signInDialog, setSignInDialog] = useState<SignInDialogState>({
    open: false,
    user: null,
  });
  const [signingIn, setSigningIn] = useState(false);

  const openSignInDialog = useCallback((user: SearchUser) => {
    setSignInDialog({ open: true, user });
  }, []);

  const closeSignInDialog = useCallback(() => {
    setSignInDialog({ open: false, user: null });
  }, []);

  const confirmSignIn = useCallback(async () => {
    if (!signInDialog.user) return;
    if (spaceId === undefined) {
      toast.error("No space selected", { position: "bottom-center" });
      return;
    }

    setSigningIn(true);
    const { username, name } = signInDialog.user;

    try {
      await signInUser(spaceId, username);
      onSuccess();
      toast.success(`${name} has been signed in`, {
        position: "bottom-center",
        icon: "👍",
      });
      setSignInDialog({ open: false, user: null });
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to sign in user. Please try again."), {
        position: "bottom-center",
      });
    } finally {
      setSigningIn(false);
    }
  }, [signInDialog.user, spaceId, onSuccess]);

  return {
    signInDialog,
    signingIn,
    openSignInDialog,
    closeSignInDialog,
    confirmSignIn,
  };
};