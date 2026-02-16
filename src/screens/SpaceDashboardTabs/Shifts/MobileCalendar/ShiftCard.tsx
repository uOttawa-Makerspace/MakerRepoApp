import React from "react";
import { AccessTime } from "@mui/icons-material";
import type { Shift } from "../types";
import { formatTime } from "../utils/utils";

interface ShiftCardProps {
  shift: Shift;
}

const ShiftDetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="shift-details">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);

const ShiftCard = React.memo(({ shift }: ShiftCardProps) => (
  <div
    className="shift-card"
    style={{ borderLeftColor: shift.color }}
  >
    <div className="shift-header">
      <h4 className="shift-title">{shift.title}</h4>
      <div
        className="shift-color-dot"
        style={{ backgroundColor: shift.color }}
      />
    </div>
    <div className="shift-time">
      <AccessTime className="time-icon" />
      <span>
        {formatTime(shift.start)} - {formatTime(shift.end)}
      </span>
    </div>
    {shift.extendedProps?.reason && (
      <ShiftDetailRow label="Reason" value={shift.extendedProps.reason} />
    )}
    {shift.extendedProps?.training && (
      <ShiftDetailRow label="Training" value={shift.extendedProps.training} />
    )}
    {shift.extendedProps?.course && (
      <ShiftDetailRow label="Course" value={shift.extendedProps.course} />
    )}
  </div>
));

ShiftCard.displayName = "ShiftCard";

export default ShiftCard;