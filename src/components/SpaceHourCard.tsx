import { valueOrSkeleton } from "../helpers";
import type { ContactInfo, DayName, OpeningDay } from "../api/types";

const DAYS: [DayName, string][] = [
  ["sunday", "Sunday"],
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
];

// "17:30" -> "5:30 PM"
const formatTime = (value: string | null): string => {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value ?? "";
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? "AM" : "PM"}`;
};

const describeDay = (day: OpeningDay): string => {
  if (day.status === "closed") return "Closed";
  if (day.opening && day.closing) {
    return `${formatTime(day.opening)} - ${formatTime(day.closing)}`;
  }
  return "Open";
};

/** `hour` is a contact from GET /api/v1/contact_infos, or {} for the loading placeholder. */
export function SpaceHourCard(props: { hour: Partial<ContactInfo> }) {
  const periods = props.hour.opening_hours;

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{valueOrSkeleton(props.hour, "name")}</h4>
        <h6 className="card-subtitle mb-2">{valueOrSkeleton(props.hour, "email")}</h6>
        <h6 className="card-subtitle mb-2">{valueOrSkeleton(props.hour, "address")}</h6>
        <h6 className="card-subtitle mb-2">
          {valueOrSkeleton(props.hour, "phone_number")}
        </h6>
        <ul className="list-group">
          {periods?.map((period, index) => (
            <div key={index}>
              <div className="card-header">{period.target_en ?? period.target_fr}</div>
              <div className="card-body">
                {period.closed_all_week ? (
                  <div>Closed all week</div>
                ) : (
                  DAYS.filter(([key]) => period.days[key].status !== "hidden").map(
                    ([key, label]) => (
                      <div key={key}>
                        {label}: {describeDay(period.days[key])}
                      </div>
                    ),
                  )
                )}
                {(period.notes_en ?? period.notes_fr) && (
                  <div className="mt-2">{period.notes_en ?? period.notes_fr}</div>
                )}
              </div>
            </div>
          ))}
          {periods?.length === 0 && (
            <div className="card-body">No opening hours listed.</div>
          )}
        </ul>
      </div>
    </div>
  );
}
