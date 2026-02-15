import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";

interface ProgramsTabProps {
  tabIndex: number;
  isAdmin: boolean;
  editing: boolean;
  saving: boolean;
  devProgram: boolean;
  volunteerProgram: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDevProgramChange: (checked: boolean) => void;
  onVolunteerProgramChange: (checked: boolean) => void;
}

const ProgramsTab: React.FC<ProgramsTabProps> = memo(
  ({
    tabIndex,
    isAdmin,
    editing,
    saving,
    devProgram,
    volunteerProgram,
    onEdit,
    onCancel,
    onSave,
    onDevProgramChange,
    onVolunteerProgramChange,
  }) => (
    <TabPanel value={tabIndex} index={1}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Program Enrollment
            </Typography>
            {isAdmin && (
              <>
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
              </>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={devProgram}
                  onChange={(e) => onDevProgramChange(e.target.checked)}
                  disabled={!isAdmin || !editing}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Development Program
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Advanced maker development training
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={volunteerProgram}
                  onChange={(e) => onVolunteerProgramChange(e.target.checked)}
                  disabled={!isAdmin || !editing}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Volunteer Program
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Volunteer opportunities and benefits
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </CardContent>
      </Card>
    </TabPanel>
  )
);

ProgramsTab.displayName = "ProgramsTab";

export default ProgramsTab;