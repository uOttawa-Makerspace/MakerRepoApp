import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getUser } from "../../../utils/Common";
import * as HTTPRequest from "../../../utils/HTTPRequests";
import {
  User,
  RfidInfo,
  Certification,
  UnlinkDialogState,
} from "../types";

export const useProfileData = (username?: string) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [rfidList, setRfidList] = useState<RfidInfo[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [remainingTrainings, setRemainingTrainings] = useState<any[]>([]);
  const [inSpaceUsers, setInSpaceUsers] = useState<any>(null);
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
      const response = await HTTPRequest.get("rfid/get_unset_rfids");
      setRfidList(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getProfile = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    try {
      const response = await HTTPRequest.get(username);
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
      toast.error("Failed to load profile", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  }, [username]);

  const getCurrentUsers = useCallback(async () => {
    try {
      const response = await HTTPRequest.get("staff_dashboard");
      setInSpaceUsers(response);
      getUnsetRfids();
    } catch (error) {
      console.error(error);
    }
  }, [getUnsetRfids]);

  useEffect(() => {
    setCurrentUser(getUser());
    getProfile();
    getCurrentUsers();
  }, [getProfile, getCurrentUsers]);

  const handleLinkRfid = useCallback(
    async (cardNumber: string) => {
      if (!profileUser) return;
      try {
        const response = await HTTPRequest.put("staff_dashboard/link_rfid", {
          card_number: cardNumber,
          user_id: profileUser.id,
        });
        if (response.status === "OK") {
          toast.success("RFID card linked successfully!", {
            position: "bottom-center",
            icon: "🎫",
          });
        } else {
          throw new Error("Link failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to link RFID card. Please try again.", {
          position: "bottom-center",
        });
      }
    },
    [profileUser]
  );

  const handleUnlinkRfid = useCallback(async () => {
    if (!unlinkDialog.cardNumber) return;
    try {
      const response = await HTTPRequest.put("staff_dashboard/unlink_rfid", {
        card_number: unlinkDialog.cardNumber,
      });
      if (response.status === "OK") {
        toast.success("RFID card unlinked successfully!", {
          position: "bottom-center",
        });
        getProfile();
        getUnsetRfids();
        setUnlinkDialog({ open: false, cardNumber: null });
      } else {
        throw new Error("Unlink failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlink RFID card. Please try again.", {
        position: "bottom-center",
      });
    }
  }, [unlinkDialog.cardNumber, getProfile, getUnsetRfids]);

  const handleSaveRole = useCallback(async () => {
    if (!profileUser) return;
    setSaving(true);
    try {
      await HTTPRequest.patch("admin/users/set_role", {
        user_ids: [profileUser.id],
        role,
      });
      toast.success("Role updated successfully!", {
        position: "bottom-center",
      });
      setEditingRole(false);
      getProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role. Please try again.", {
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
      await HTTPRequest.patch("change_programs", {
        user_id: profileUser.id,
        dev_program: devProgram,
        volunteer: volunteerProgram,
      });
      toast.success("Programs updated successfully!", {
        position: "bottom-center",
      });
      setEditingPrograms(false);
      getProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update programs. Please try again.", {
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