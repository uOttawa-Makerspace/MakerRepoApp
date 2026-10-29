import toast from "react-hot-toast";
import { setMySpace } from "../api/endpoints";
import { errorMessage } from "../api/client";
import type { SpaceDashboardData } from "../api/types";

type ChangeSpaceProps = {
  inSpaceUsers: SpaceDashboardData | null;
  handleReloadCurrentUsers: () => void;
};

const ChangeSpace = ({ inSpaceUsers, handleReloadCurrentUsers }: ChangeSpaceProps) => {
  const changeSpace = (spaceId: number | string) => {
    setMySpace(Number(spaceId))
      .then(() => {
        handleReloadCurrentUsers();
      })
      .catch((error) => {
        console.error(error);
        toast.error(errorMessage(error, "Failed to change space. Please try again."), {
          position: "bottom-center",
        });
      });
  };

  return (
    <>
      <select
        value={inSpaceUsers?.space?.id ?? ""}
        onChange={(e) => changeSpace(e.target.value)}
        className="form-select mb-2"
      >
        {inSpaceUsers?.spaces?.map((space) => (
          <option key={space.id} value={space.id}>
            {space.name}
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
