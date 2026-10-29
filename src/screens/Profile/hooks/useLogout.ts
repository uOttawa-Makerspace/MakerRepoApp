import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../../api/endpoints";
import { LoggedInContext } from "../../../utils/Contexts";

export const useLogout = () => {
  const { setLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const openLogoutDialog = useCallback(() => setLogoutDialogOpen(true), []);
  const closeLogoutDialog = useCallback(() => setLogoutDialogOpen(false), []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);

    try {
      // DELETE /api/v1/session, then the stored tokens are cleared whatever the answer.
      await logout();
      setLoggedIn(false);
      toast.success("Logged out successfully", {
        position: "bottom-center",
      });
      navigate("/login");
    } finally {
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  }, [setLoggedIn, navigate]);

  return {
    logoutDialogOpen,
    loggingOut,
    openLogoutDialog,
    closeLogoutDialog,
    handleLogout,
  };
};