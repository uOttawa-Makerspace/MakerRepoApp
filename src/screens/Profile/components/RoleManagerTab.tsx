import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Button,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactElement;
  color?: "error" | "warning" | "inherit";
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Full system access and permissions",
    icon: <AdminIcon color="error" />,
  },
  {
    value: "staff",
    label: "Staff",
    description: "Staff dashboard and training permissions",
    icon: <WorkIcon color="warning" />,
  },
  {
    value: "regular_user",
    label: "Regular User",
    description: "Standard user access",
    icon: <PersonIcon />,
  },
];

interface RoleManagerTabProps {
  tabIndex: number;
  currentRole: string;
  selectedRole: string;
  editing: boolean;
  saving: boolean;
  onRoleChange: (role: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const RoleManagerTab: React.FC<RoleManagerTabProps> = memo(
  ({
    tabIndex,
    currentRole,
    selectedRole,
    editing,
    saving,
    onRoleChange,
    onEdit,
    onCancel,
    onSave,
  }) => (
    <TabPanel value={tabIndex} index={3}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              User Role
            </Typography>
            {!editing ? (
              <Button
                startIcon={<EditIcon />}
                onClick={onEdit}
                size="small"
              >
                Edit
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  startIcon={
                    saving ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                  onClick={onSave}
                  variant="contained"
                  size="small"
                  disabled={saving}
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Alert severity="info" sx={{ mb: 2 }}>
            Current Role:{" "}
            <strong>{currentRole.replace("_", " ").toUpperCase()}</strong>
          </Alert>

          <FormControl component="fieldset" disabled={!editing}>
            <RadioGroup
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
            >
              {ROLE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {option.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </TabPanel>
  )
);

RoleManagerTab.displayName = "RoleManagerTab";

export default RoleManagerTab;