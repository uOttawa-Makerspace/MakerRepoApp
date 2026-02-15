import React, { memo } from "react";
import { Box } from "@mui/material";
import { User } from "../types";
import MobileUserListItem from "./MobileUserListItem";

interface MobileUserListProps {
  users: User[];
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const MobileUserList: React.FC<MobileUserListProps> = memo(
  ({ users, onNavigate, onSignOut }) => (
    <Box sx={{ px: 2 }}>
      {users.map((user) => (
        <MobileUserListItem
          key={user.id}
          user={user}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      ))}
    </Box>
  )
);

MobileUserList.displayName = "MobileUserList";

export default MobileUserList;