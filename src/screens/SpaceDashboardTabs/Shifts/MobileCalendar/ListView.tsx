import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import type { Shift } from "../types";

interface ListViewProps {
  shifts: Shift[];
}

const LIST_HEADER_TOOLBAR = {
  left: "prev,next",
  center: "title",
  right: "",
} as const;

const LIST_TIME_FORMAT = {
  hour: "numeric" as const,
  minute: "2-digit" as const,
  hour12: true,
};

const ListView = React.memo(({ shifts }: ListViewProps) => (
  <div className="list-view">
    <FullCalendar
      plugins={[listPlugin]}
      initialView="listWeek"
      headerToolbar={LIST_HEADER_TOOLBAR}
      height="auto"
      timeZone="America/New_York"
      events={shifts}
      eventTimeFormat={LIST_TIME_FORMAT}
    />
  </div>
));

ListView.displayName = "ListView";

export default ListView;