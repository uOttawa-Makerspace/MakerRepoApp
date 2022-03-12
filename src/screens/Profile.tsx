import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { replaceNoneWithNotAvailable } from "../helpers";
import { getUser } from "../utils/Common";
import * as HTTPRequest from "../utils/HTTPRequests";
import { Tabs, Tab } from "@mui/material";
import { TabPanel, a11yProps } from "../components/TabPanel";

type ProfileParams = {
  username: string;
};

const Profile = () => {
  const { username } = useParams<ProfileParams>();
  const [user, setUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [programs, setPrograms] = useState(null);
  const [certifications, setCertifications] = useState<any[] | null>(null);
  const [remainingTrainings, setRemainingTraings] = useState(null);
  const [role, setRole] = useState("");
  const [devProgram, setDevProgram] = useState(false);
  const [volunteerProgram, setVolunteerProgram] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setTabIndex(newValue);
  };

  const handleRoleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setRole(event.target.value);
  };

  const handleDevProgramChange = () => {
    setDevProgram(!devProgram);
  };

  const handleVolunteerProgramChange = () => {
    setVolunteerProgram(!volunteerProgram);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (e.target.id === "role-form") {
      setUserRole();
    } else if (e.target.id === "programs-form") {
      setUserPrograms();
    }
  };

  useEffect(() => {
    setUser(getUser());
    getProfile();
  }, []);

  const getProfile = () => {
    HTTPRequest.get(username)
      .then((response) => {
        setProfileUser(response.user);
        setPrograms(response.programs);
        setCertifications(response.certifications);
        setRemainingTraings(response.remaining_trainings);

        if (response.programs.includes("Volunteer Program")) {
          setVolunteerProgram(true);
        }

        if (response.programs.includes("Development Program")) {
          setDevProgram(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setUserRole = () => {
    HTTPRequest.patch("admin/users/set_role", {
      id: profileUser.id,
      role: role,
    })
      .then(() => {
        getProfile();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setUserPrograms = () => {
    HTTPRequest.patch("change_programs", {
      user_id: profileUser.id,
      dev_program: devProgram,
      volunteer: volunteerProgram,
    })
      .then(() => {
        getProfile();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {profileUser == null ||
      programs == null ||
      certifications == null ||
      remainingTrainings == null ? (
        <div>Loading ...</div>
      ) : (
        <div>
          <Tabs
            style={{ width: "100vw" }}
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
          >
            <Tab label="About" {...a11yProps(0)} />
            <Tab label="Programs" {...a11yProps(1)} />
            <Tab label="Certifications" {...a11yProps(2)} />
            {user.role === "admin" && (
              <Tab label="Role Manager" {...a11yProps(3)} />
            )}
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <ul className="list-group">
              <li className="list-group-item">
                Username: {replaceNoneWithNotAvailable(profileUser.username)}
              </li>
              <li className="list-group-item">
                Name: {replaceNoneWithNotAvailable(profileUser.name)}
              </li>
              <li className="list-group-item">
                Email: {replaceNoneWithNotAvailable(profileUser.email)}
              </li>
              <li className="list-group-item">
                Faculty: {replaceNoneWithNotAvailable(profileUser.faculty)}
              </li>
              <li className="list-group-item">
                Program: {replaceNoneWithNotAvailable(profileUser.program)}
              </li>
              <li className="list-group-item">
                Year of study:{" "}
                {replaceNoneWithNotAvailable(profileUser.year_of_study)}
              </li>
              <li className="list-group-item">
                Identity: {replaceNoneWithNotAvailable(profileUser.identity)}
              </li>
            </ul>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <form onSubmit={onSubmit} id="programs-form">
              <div className="list-group mx-0">
                <label className="list-group-item d-flex gap-2">
                  <input
                    className="form-check-input flex-shrink-0"
                    type="checkbox"
                    disabled={user.role !== "admin"}
                    checked={devProgram}
                    value={String(devProgram)}
                    onChange={handleDevProgramChange}
                  />
                  <span>Dev Program</span>
                </label>
                <label className="list-group-item d-flex gap-2">
                  <input
                    className="form-check-input flex-shrink-0"
                    type="checkbox"
                    disabled={user.role !== "admin"}
                    checked={volunteerProgram}
                    value={String(volunteerProgram)}
                    onChange={handleVolunteerProgramChange}
                  />
                  <span>Volunteer</span>
                </label>
              </div>
              {user.role === "admin" && (
                <>
                  <br />
                  <button type="submit" className="btn btn-primary">
                    Update Programs
                  </button>
                </>
              )}
            </form>
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            Certifications
            <ul className="list-group">
              {certifications.map((certification: any, index: number) => (
                <li className="list-group-item" key={index}>
                  Name: {certification.training.name}
                  <br />
                  On:{" "}
                  {new Date(
                    Date.parse(certification.updated_at)
                  ).toDateString()}
                </li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            {user.role === "admin" && (
              <>
                <p>Current role: {profileUser.role}</p>
                <form onSubmit={onSubmit} id="role-form">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="role-admin"
                      value="admin"
                      checked={role === "admin"}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="role-admin">
                      Admin
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="radio-staff"
                      value="staff"
                      checked={role === "staff"}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="radio-staff">
                      Staff
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="radio-regular"
                      value="regular_user"
                      checked={role === "regular_user"}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="radio-regular">
                      Regular User
                    </label>
                  </div>
                  <br />
                  <button className="btn btn-primary">Update role</button>
                </form>
              </>
            )}
          </TabPanel>
        </div>
      )}
    </div>
  );
};

export default Profile;
