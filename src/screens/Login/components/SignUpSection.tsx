import React, { memo } from "react";
import {
  Divider,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { EXTERNAL_LINKS } from "../constants";

const SignUpSection: React.FC = memo(() => (
  <>
    <Divider sx={{ my: 3 }}>
      <Typography variant="body2" color="text.secondary">
        OR
      </Typography>
    </Divider>

    <Paper
      variant="outlined"
      sx={{
        p: 2,
        textAlign: "center",
        bgcolor: "background.default",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Don't have an account?
      </Typography>
      <Button
        href={EXTERNAL_LINKS.createAccount}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        size="medium"
        startIcon={<PersonAddIcon />}
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        Create Account
      </Button>
    </Paper>
  </>
));

SignUpSection.displayName = "SignUpSection";

export default SignUpSection;