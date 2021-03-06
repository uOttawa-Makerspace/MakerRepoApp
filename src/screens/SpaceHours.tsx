import React, { useEffect, useState } from "react";
import { SpaceHourCard } from "../components/SpaceHourCard";
import * as HTTPRequest from "../utils/HTTPRequests";

const SpaceHours = () => {
  const [hours, setHours] = useState<any>(null);
  const [errors, setErrors] = useState(false);

  const getHours = () => {
    HTTPRequest.get("hours")
      .then((response) => {
        setHours(response);
      })
      .catch((error) => {
        setErrors(true);
        console.error(error);
      });
  };

  useEffect(() => {
    getHours();
  }, []);

  return (
    <div>
      Space Hours
      {!errors && hours ? (
        <div>
          {hours.map((hour: any, index: number | null) => (
            <SpaceHourCard hour={hour} key={index} />
          ))}
        </div>
      ) : (
        <div>
          <SpaceHourCard hour={{}} />
          <SpaceHourCard hour={{}} />
        </div>
      )}
    </div>
  );
};

export default SpaceHours;
