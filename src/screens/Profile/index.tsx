import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { ProfileParams } from "./types";
import { useProfileData } from "./hooks/useProfileData";
import { useLogout } from "./hooks/useLogout";

import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import AboutTab from "./components/AboutTab";
import ProgramsTab from "./components/ProgramsTab";
import CertificationsTab from "./components/CertificationsTab";
import RoleManagerTab from "./components/RoleManagerTab";
import RfidTab from "./components/RfidTab";
import UnlinkRfidDialog from "./components/UnlinkRfidDialog";
import LogoutSection from "./components/LogoutSection";
import LogoutDialog from "./components/LogoutDialog";

const Profile: React.FC = () => {
  const { username } = useParams<ProfileParams>();
  const [tabIndex, setTabIndex] = useState(0);

  const {
    currentUser,
    profileUser,
    rfidList,
    certifications,
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
    handleLinkRfid,
    handleUnlinkRfid,
    handleSaveRole,
    handleSavePrograms,
    cancelEditRole,
    cancelEditPrograms,
    closeUnlinkDialog,
    openUnlinkDialog,
    getCurrentUsers,
  } = useProfileData(username);

  const {
    logoutDialogOpen,
    loggingOut,
    openLogoutDialog,
    closeLogoutDialog,
    handleLogout,
  } = useLogout();

  const handleTabChange = useCallback((newValue: number) => {
    setTabIndex(newValue);
  }, []);

  // Only show logout on own profile
  const isOwnProfile = currentUser?.username === profileUser?.username;

  if (loading || !profileUser || !currentUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <ProfileHeader user={profileUser} />

      <ProfileTabs
        tabIndex={tabIndex}
        onTabChange={handleTabChange}
        certCount={certifications.length}
        isAdmin={isAdmin}
      />

      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <AboutTab tabIndex={tabIndex} user={profileUser} />

        <ProgramsTab
          tabIndex={tabIndex}
          isAdmin={isAdmin}
          editing={editingPrograms}
          saving={saving}
          devProgram={devProgram}
          volunteerProgram={volunteerProgram}
          onEdit={() => setEditingPrograms(true)}
          onCancel={cancelEditPrograms}
          onSave={handleSavePrograms}
          onDevProgramChange={setDevProgram}
          onVolunteerProgramChange={setVolunteerProgram}
        />

        <CertificationsTab
          tabIndex={tabIndex}
          certifications={certifications}
        />

        {isAdmin && (
          <RoleManagerTab
            tabIndex={tabIndex}
            currentRole={profileUser.role}
            selectedRole={role}
            editing={editingRole}
            saving={saving}
            onRoleChange={setRole}
            onEdit={() => setEditingRole(true)}
            onCancel={cancelEditRole}
            onSave={handleSaveRole}
          />
        )}

        <RfidTab
          tabIndex={tabIndex}
          panelIndex={isAdmin ? 4 : 3}
          user={profileUser}
          rfidList={rfidList}
          inSpaceUsers={inSpaceUsers}
          onLinkRfid={handleLinkRfid}
          onOpenUnlinkDialog={openUnlinkDialog}
          onReloadCurrentUsers={getCurrentUsers}
        />

        {isOwnProfile && (
          <Box sx={{ mt: 4 }}>
            <LogoutSection onLogoutClick={openLogoutDialog} />
          </Box>
        )}
      </Box>

      <UnlinkRfidDialog
        open={unlinkDialog.open}
        cardNumber={unlinkDialog.cardNumber}
        userName={profileUser.name}
        onClose={closeUnlinkDialog}
        onConfirm={handleUnlinkRfid}
      />

      <LogoutDialog
        open={logoutDialogOpen}
        loggingOut={loggingOut}
        onClose={closeLogoutDialog}
        onConfirm={handleLogout}
      />
    </Box>
  );
};

export default Profile;