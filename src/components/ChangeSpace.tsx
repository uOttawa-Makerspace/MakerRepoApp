import React from "react";
import * as HTTPRequest from "../utils/HTTPRequests";

type ChangeSpaceProps = {
  inSpaceUsers: any;
  handleReloadCurrentUsers: () => void;
};

const ChangeSpace = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
}: ChangeSpaceProps) => {
  const changeSpace = (spaceId: number | string) => {
    HTTPRequest.put(`staff_dashboard/change_space?space_id=${spaceId}`, {})
      .then(() => {
        handleReloadCurrentUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <select
        value={inSpaceUsers !== null && inSpaceUsers?.space?.id}
        onChange={(e) => changeSpace(e.target.value)}
        className="form-select mb-2"
      >
        {inSpaceUsers !== null &&
          inSpaceUsers?.space_list?.map((space: any) => (
            <option key={space[1]} value={space[1]}>
              {space[0]}
            </option>
          ))}
      </select>
      <div className="d-grid gap-2">
        <button
          type="button"
          onClick={() => handleReloadCurrentUsers()}
          className="btn btn-primary"
        >
          Refresh Space
        </button>
      </div>
    </>
  );
};

export default ChangeSpace;
