import React, { useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import type { Shift } from "../types";
import { SLOT_MIN_TIME, SLOT_MAX_TIME } from "../utils/utils";

interface DesktopCalendarProps {
  shifts: Shift[];
}

const PLUGINS = [timeGridPlugin, dayGridPlugin, listPlugin, googleCalendarPlugin];

const HEADER_TOOLBAR = {
  left: "prev,today,next",
  center: "title",
  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
} as const;

const TIME_FORMAT = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  hour12: true,
};

const EventContent = ({ timeText, event }: any) => (
  <div className="custom-event">
    <div className="event-time">{timeText}</div>
    <div className="event-title">{event.title}</div>
    {event.extendedProps?.reason && (
      <div className="event-reason">{event.extendedProps.reason}</div>
    )}
  </div>
);

const DesktopCalendar = React.memo(({ shifts }: DesktopCalendarProps) => {
  const renderEventContent = useCallback(
    (eventInfo: any) => (
      <EventContent
        timeText={eventInfo.timeText}
        event={eventInfo.event}
      />
    ),
    []
  );

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={PLUGINS}
        initialView="timeGridWeek"
        headerToolbar={HEADER_TOOLBAR}
        height={600}
        allDaySlot={false}
        timeZone="America/New_York"
        selectable={false}
        editable={false}
        slotMinTime={SLOT_MIN_TIME}
        slotMaxTime={SLOT_MAX_TIME}
        eventTimeFormat={TIME_FORMAT}
        dayMaxEvents
        events={shifts}
        nowIndicator
        eventDisplay="block"
        eventContent={renderEventContent}
      />
    </div>
  );
});

DesktopCalendar.displayName = "DesktopCalendar";

export default DesktopCalendar;