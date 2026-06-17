import React, { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import type { FormErrors, NewTrainingSessionData } from "../types";

interface SelectFieldProps {
  label: string;
  value: string;
  options: [string | number, string][] | string[];
  error?: string;
  onChange: (value: string) => void;
}

const SelectField = memo<SelectFieldProps>(
  ({ label, value, options, error, onChange }) => {
    const isTupleArray =
      options.length > 0 && Array.isArray(options[0]);

    return (
      <FormControl fullWidth error={!!error}>
        <InputLabel>{label} *</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={`${label} *`}
        >
          {isTupleArray
            ? (options as [string | number, string][]).map(([id, name]) => (
                <MenuItem key={id} value={String(id)}>
                  {name}
                </MenuItem>
              ))
            : (options as string[]).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

SelectField.displayName = "SelectField";

interface TrainingDetailsCardProps {
  data: NewTrainingSessionData;
  trainingId: string;
  trainingLevel: string;
  trainingCourse: string;
  trainingInstructor: string;
  errors: FormErrors;
  onTrainingChange: (v: string) => void;
  onLevelChange: (v: string) => void;
  onCourseChange: (v: string) => void;
  onInstructorChange: (v: string) => void;
  clearFieldError: (field: keyof FormErrors) => void;
}

const TrainingDetailsCard = memo<TrainingDetailsCardProps>(
  ({
    data,
    trainingId,
    trainingLevel,
    trainingCourse,
    trainingInstructor,
    errors,
    onTrainingChange,
    onLevelChange,
    onCourseChange,
    onInstructorChange,
    clearFieldError,
  }) => {
    const handleChange = useCallback(
      (field: keyof FormErrors, setter: (v: string) => void) =>
        (value: string) => {
          setter(value);
          clearFieldError(field);
        },
      [clearFieldError]
    );

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Training Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2.5}>
            <SelectField
              label="Training"
              value={trainingId}
              options={data.trainings}
              error={errors.training}
              onChange={handleChange("training", onTrainingChange)}
            />
            <SelectField
              label="Level"
              value={trainingLevel}
              options={data.level}
              error={errors.level}
              onChange={handleChange("level", onLevelChange)}
            />
            <SelectField
              label="Course"
              value={trainingCourse}
              options={data.course_names}
              error={errors.course}
              onChange={handleChange("course", onCourseChange)}
            />
            <SelectField
              label="Instructor"
              value={trainingInstructor}
              options={data.admins}
              error={errors.instructor}
              onChange={handleChange("instructor", onInstructorChange)}
            />
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

TrainingDetailsCard.displayName = "TrainingDetailsCard";
export default TrainingDetailsCard;