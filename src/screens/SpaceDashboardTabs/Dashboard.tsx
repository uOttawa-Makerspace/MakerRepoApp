import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import * as HTTPRequest from "../../utils/HTTPRequests";

type DashboardProps = {
  inSpaceUsers: any;
  handleReloadCurrentUsers: () => void;
};

const Dashboard = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
}: DashboardProps) => {
  const history = useHistory();

  const sendToUserProfile = (username: string) => {
    history.push(`/profile/${username}`);
  };

  const signOutUser = (username: string) => {
    HTTPRequest.put(
      `staff_dashboard/remove_users?dropped_users[]=${username}`,
      {}
    )
      .then(() => {
        handleReloadCurrentUsers();
        toast.error(`${username} has successfully been signed out!`, {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h3 className="text-center mt-2">Signed In Users</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Flagged?</th>
              <th scope="col">Sign Out</th>
            </tr>
          </thead>
          <tbody>
            {inSpaceUsers !== null &&
              inSpaceUsers.length > 0 &&
              inSpaceUsers.map((dashboardUser: any) => (
                <tr key={dashboardUser.id}>
                  <td>
                    <p
                      onClick={() => sendToUserProfile(dashboardUser.username)}
                    >
                      {dashboardUser.name}
                    </p>
                  </td>
                  <td>{dashboardUser.email}</td>
                  <td>{dashboardUser.flagged ? "Yes" : "No"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => signOutUser(dashboardUser.username)}
                      className="btn btn-danger"
                    >
                      Sign Out
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;
