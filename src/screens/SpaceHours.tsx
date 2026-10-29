import { useEffect, useState } from "react";
import { SpaceHourCard } from "../components/SpaceHourCard";
import { listContactInfos } from "../api/endpoints";
import type { ContactInfo } from "../api/types";

const SpaceHours = () => {
  const [hours, setHours] = useState<ContactInfo[] | null>(null);
  const [errors, setErrors] = useState(false);

  const getHours = () => {
    listContactInfos()
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
          {hours.map((hour, index) => (
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