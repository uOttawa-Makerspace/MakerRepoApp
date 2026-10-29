import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getStoredUser } from "../../../api/tokens";
import {
  getProfile as fetchProfile,
  linkRfid,
  listUnlinkedCards,
  loadSpaceDashboard,
  setUserPrograms,
  setUserRole,
  unlinkRfid,
} from "../../../api/endpoints";
import { errorMessage } from "../../../api/client";
import type { AssignableRole, SessionUser, SpaceDashboardData } from "../../../api/types";
import {
  User,
  RfidInfo,
  Certification,
  UnlinkDialogState,
  RemainingTraining,
} from "../types";

export const useProfileData = (username?: string) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [rfidList, setRfidList] = useState<RfidInfo[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [remainingTrainings, setRemainingTrainings] = useState<RemainingTraining[]>([]);
  const [inSpaceUsers, setInSpaceUsers] = useState<SpaceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [role, setRole] = useState("");
  const [devProgram, setDevProgram] = useState(false);
  const [volunteerProgram, setVolunteerProgram] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editingPrograms, setEditingPrograms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlinkDialog, setUnlinkDialog] = useState<UnlinkDialogState>({
    open: false,
    cardNumber: null,
  });

  const getUnsetRfids = useCallback(async () => {
    try {
      setRfidList(await listUnlinkedCards());
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Does NOT touch `loading` — safe to call for refreshes
  const getProfile = useCallback(async () => {
    if (!username) return;
    try {
      const response = await fetchProfile(username);
      setProfileUser(response.user);
      setPrograms(response.programs || []);
      setCertifications(response.certifications || []);
      setRemainingTrainings(response.remaining_trainings || []);
      setRole(response.user.role);
      setVolunteerProgram(
        (response.programs || []).includes("Volunteer Program")
      );
      setDevProgram(
        (response.programs || []).includes("Development Program")
      );
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to load profile"), { position: "bottom-center" });
    }
  }, [username]);

  const getCurrentUsers = useCallback(async () => {
    try {
      setInSpaceUsers(await loadSpaceDashboard());
      await getUnsetRfids();
    } catch (error) {
      console.error(error);
    }
  }, [getUnsetRfids]);

  // Only place that manages `loading`
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const me = getStoredUser();
      setCurrentUser(me);
      // Space and card data are staff-only endpoints (403 for anyone else).
      const isStaff = me?.role === "staff" || me?.role === "admin";
      await Promise.all([getProfile(), isStaff ? getCurrentUsers() : null]);
      setLoading(false);
    };
    init();
  }, [getProfile, getCurrentUsers]);

  const handleLinkRfid = useCallback(
    async (cardNumber: string) => {
      if (!profileUser) return;
      try {
        await linkRfid(profileUser.id, cardNumber);
        toast.success("RFID card linked successfully!", {
          position: "bottom-center",
          icon: "🎫",
        });
        // Refresh profile so user.rfid updates, and refresh available cards
        await getProfile();
        await getUnsetRfids();
      } catch (error) {
        console.error(error);
        toast.error(errorMessage(error, "Failed to link RFID card. Please try again."), {
          position: "bottom-center",
        });
        throw error; // Re-throw so NFC scan UI can show error status
      }
    },
    [profileUser, getProfile, getUnsetRfids]
  );

  const handleUnlinkRfid = useCallback(async () => {
    if (!unlinkDialog.cardNumber || !profileUser) return;
    try {
      await unlinkRfid(profileUser.id);
      toast.success("RFID card unlinked successfully!", {
        position: "bottom-center",
      });
      // Refresh profile so user.rfid clears, and refresh available cards
      await getProfile();
      await getUnsetRfids();
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to unlink RFID card. Please try again."), {
        position: "bottom-center",
      });
    } finally {
      // ALWAYS close the dialog, even if something went wrong
      setUnlinkDialog({ open: false, cardNumber: null });
    }
  }, [unlinkDialog.cardNumber, profileUser, getProfile, getUnsetRfids]);

  const handleSaveRole = useCallback(async () => {
    if (!profileUser) return;
    setSaving(true);
    try {
      await setUserRole(profileUser.id, role as AssignableRole);
      toast.success("Role updated successfully!", {
        position: "bottom-center",
      });
      setEditingRole(false);
      await getProfile();
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to update role. Please try again."), {
        position: "bottom-center",
      });
    } finally {
      setSaving(false);
    }
  }, [profileUser, role, getProfile]);

  const handleSavePrograms = useCallback(async () => {
    if (!profileUser) return;
    setSaving(true);
    try {
      await setUserPrograms(profileUser.id, {
        development: devProgram,
        volunteer: volunteerProgram,
      });
      toast.success("Programs updated successfully!", {
        position: "bottom-center",
      });
      setEditingPrograms(false);
      await getProfile();
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to update programs. Please try again."), {
        position: "bottom-center",
      });
    } finally {
      setSaving(false);
    }
  }, [profileUser, devProgram, volunteerProgram, getProfile]);

  const cancelEditRole = useCallback(() => {
    setEditingRole(false);
    if (profileUser) setRole(profileUser.role);
  }, [profileUser]);

  const cancelEditPrograms = useCallback(() => {
    setEditingPrograms(false);
    setDevProgram(programs.includes("Development Program"));
    setVolunteerProgram(programs.includes("Volunteer Program"));
  }, [programs]);

  const closeUnlinkDialog = useCallback(() => {
    setUnlinkDialog({ open: false, cardNumber: null });
  }, []);

  const openUnlinkDialog = useCallback((cardNumber: string) => {
    setUnlinkDialog({ open: true, cardNumber });
  }, []);

  const isAdmin = currentUser?.role === "admin";
  const isOwnProfile = currentUser?.username === profileUser?.username;

  return {
    currentUser,
    profileUser,
    rfidList,
    programs,
    certifications,
    remainingTrainings,
    inSpaceUsers,
    loading,
    saving,
    role,
    setRole,
    devProgram,
    setDevProgram,
    volunteerProgram,
    setVolunteerProgram,
    editingRole,
    setEditingRole,
    editingPrograms,
    setEditingPrograms,
    unlinkDialog,
    isAdmin,
    isOwnProfile,
    handleLinkRfid,
    handleUnlinkRfid,
    handleSaveRole,
    handleSavePrograms,
    cancelEditRole,
    cancelEditPrograms,
    closeUnlinkDialog,
    openUnlinkDialog,
    getCurrentUsers,
  };
};