import React, { memo, useState, useCallback } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from "@mui/icons-material";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  error?: string;
  disabled: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = memo(
  ({ value, onChange, onKeyPress, error, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={handleChange}
        onKeyPress={onKeyPress}
        error={!!error}
        helperText={error}
        disabled={disabled}
        autoComplete="current-password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleVisibility}
                edge="end"
                disabled={disabled}
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;