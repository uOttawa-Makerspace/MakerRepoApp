import ReactHtmlParser from "react-html-parser";
import { Skeleton } from "@mui/material";
import { valueOrSkeleton } from "../helpers";

export function SpaceHourCard(props: { hour: any }) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{valueOrSkeleton(props.hour, "name")}</h4>
        <h6 className="card-subtitle mb-2">
          {valueOrSkeleton(props.hour, "email")}
        </h6>
        <h6 className="card-subtitle mb-2">
          {valueOrSkeleton(props.hour, "address")}
        </h6>
        <h6 className="card-subtitle mb-2">
          {valueOrSkeleton(props.hour, "phone_number")}
        </h6>
        <ul className="list-group">
          <div>
            <div className="card-header">Students</div>
            <div className="card-body">
              {valueOrSkeleton(
                props.hour,
                "opening_hour.students",
                "rectangular",
                undefined,
                150,
                ReactHtmlParser
              )}
            </div>
          </div>
          <div>
            <div className="card-header">Public</div>
            <div className="card-body">
              {valueOrSkeleton(
                props.hour,
                "opening_hour.public",
                "text",
                undefined,
                undefined,
                ReactHtmlParser
              )}
            </div>
          </div>
          <div>
            <div className="card-header">Summer</div>
            <div className="card-body">
              {valueOrSkeleton(
                props.hour,
                "opening_hour.summer",
                "text",
                undefined,
                undefined,
                ReactHtmlParser
              )}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
