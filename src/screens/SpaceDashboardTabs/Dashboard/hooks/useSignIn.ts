import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type { User } from "../types";

export interface SignInDialogState {
  open: boolean;
  user: User | null;
}

export const useSignIn = (onSuccess: () => void) => {
  const [signInDialog, setSignInDialog] = useState<SignInDialogState>({
    open: false,
    user: null,
  });
  const [signingIn, setSigningIn] = useState(false);

  const openSignInDialog = useCallback((user: User) => {
    setSignInDialog({ open: true, user });
  }, []);

  const closeSignInDialog = useCallback(() => {
    setSignInDialog({ open: false, user: null });
  }, []);

  const confirmSignIn = useCallback(async () => {
    if (!signInDialog.user) return;

    setSigningIn(true);
    const { username, name } = signInDialog.user;

    try {
      await HTTPRequest.put(
        `staff_dashboard/add_users?added_users=${username}`,
        {}
      );
      onSuccess();
      toast.success(`${name} has been signed in`, {
        position: "bottom-center",
        icon: "👍",
      });
      setSignInDialog({ open: false, user: null });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in user. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSigningIn(false);
    }
  }, [signInDialog.user, onSuccess]);

  return {
    signInDialog,
    signingIn,
    openSignInDialog,
    closeSignInDialog,
    confirmSignIn,
  };
};