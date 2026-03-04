import React, { memo } from "react";
import { Box } from "@mui/material";
import { User } from "../types";
import MobileUserListItem from "./MobileUserListItem";

interface MobileUserListProps {
  users: User[];
  spaceName?: string;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const MobileUserList: React.FC<MobileUserListProps> = memo(
  ({ users, spaceName, onNavigate, onSignOut }) => (
    <Box sx={{ px: 2 }}>
      {users.map((user) => (
        <MobileUserListItem
          key={user.id}
          user={user}
          spaceName={spaceName}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      ))}
    </Box>
  )
);

MobileUserList.displayName = "MobileUserList";

export default MobileUserList;