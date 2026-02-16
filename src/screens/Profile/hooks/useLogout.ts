import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../utils/HTTPRequests";
import { removeUserSession } from "../../../utils/Common";
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
      await HTTPRequest.get("logout");
      setLoggedIn(false);
      removeUserSession();
      toast.success("Logged out successfully", {
        position: "bottom-center",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout. Please try again.", {
        position: "bottom-center",
      });
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