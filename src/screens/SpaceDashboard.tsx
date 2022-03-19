import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tab,
  Tabs,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as HTTPRequest from "../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../components/TabPanel";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface userSearch {
  name: string;
  username: string;
}

function SpaceDashboard() {
  const history = useHistory();
  const [inSpaceUsers, setInSpaceUsers] = useState<string | null>(null);
  const [newTrainingSession, setNewTrainingSession] = useState<string | null>(
    null
  );
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [trainingLevel, setTrainingLevel] = useState<string | null>(null);
  const [trainingCourse, setTrainingCourse] = useState<string | null>(null);
  const [trainingInstructor, setTrainingInstructor] = useState<string>("");
  const [trainingUsers, setTrainingUsers] = useState<string[]>([]);
  const [trainingSessionsData, setTrainingSessionsData] = useState<
    string | null
  >(null);
  const [searchedUsers, setSearchedUsers] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const [typeAheadValue, setTypeAheadValue] = useState<string>("");
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<userSearch[]>([]);

  const handleTabChange = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    getCurrentUsers();
    getNewTrainingSession();
    getTrainingSessions();
  }, []);

  const getCurrentUsers = () => {
    HTTPRequest.get("staff_dashboard")
      .then((response) => {
        setInSpaceUsers(JSON.stringify(response));
        getNewTrainingSession();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getNewTrainingSession = () => {
    HTTPRequest.get("staff/training_sessions/new")
      .then((response) => {
        setNewTrainingSession(JSON.stringify(response));
        setTrainingId(response.trainings[0][0]);
        setTrainingLevel(response.level[0]);
        setTrainingCourse(response.course_names[0]);
        setTrainingInstructor(response.admins[0][0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let trainingUsersArray = [...trainingUsers, event.target.id];
    if (trainingUsers.includes(event.target.id)) {
      trainingUsersArray = trainingUsersArray.filter(
        (u) => u !== event.target.id
      );
    }
    setTrainingUsers(trainingUsersArray);
  };

  const selectAllTrainingUsers = () => {
    if (newTrainingSession !== null) {
      const trainingUsersArray = JSON.parse(newTrainingSession).users.map(
        (u: any[]) => String(u[0])
      );
      setTrainingUsers(trainingUsersArray);
    }
  };

  const startTraining = () => {
    if (inSpaceUsers !== null) {
      HTTPRequest.post("staff/training_sessions", {
        training_session: {
          space_id: JSON.parse(inSpaceUsers).space.id,
        },
        training_id: trainingId,
        level: trainingLevel,
        course: trainingCourse,
        user_id: trainingInstructor,
        training_session_users: trainingUsers,
      })
        .then((response) => {
          if (response.data.created === true) {
            setTrainingUsers([]);
            toast.success("Training session created successfully!", {
              position: "bottom-center",
            });
            history.push("/staff/training_sessions");
          } else {
            toast.error("Error creating training session!", {
              position: "bottom-center",
            });
          }
          getTrainingSessions();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const getTrainingSessions = () => {
    HTTPRequest.get("staff/training_sessions")
      .then((response) => {
        setTrainingSessionsData(JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const certifySession = (training_session_id: string) => {
    HTTPRequest.post(
      `staff/training_sessions/${training_session_id}/certify_trainees`,
      {}
    )
      .then((response) => {
        if (response.data.certified === true) {
          toast.success(
            "Users in the training session have been certified successfully!",
            {
              position: "bottom-center",
            }
          );
          getTrainingSessions();
        } else {
          toast.error(
            "Error while certifying some users in the training session! Maybe a user already has that certification.",
            {
              position: "bottom-center",
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const changeSpace = (space_id: number | string) => {
    HTTPRequest.put(`staff_dashboard/change_space?space_id=${space_id}`, {})
      .then(() => {
        getCurrentUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSearchedUsers = (searchValue: string) => {
    HTTPRequest.get(`staff_dashboard/search?query=${searchValue}`)
      .then((response) => {
        setSearchedUsers(JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signOutUser = (username: string) => {
    HTTPRequest.put(
      `staff_dashboard/remove_users?dropped_users[]=${username}`,
      {}
    )
      .then(() => {
        getCurrentUsers();
        toast.error(`${username} has successfully been signed out!`, {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInUser = (username: string) => {
    HTTPRequest.put(`staff_dashboard/add_users?added_users=${username}`, {})
      .then(() => {
        getCurrentUsers();
        toast.success(`${username} has successfully been signed in!`, {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (query: string) => {
    setIsLoading(true);

    HTTPRequest.get(`staff_dashboard/populate_users?search=${query}`)
      .then((response) => {
        console.log(response);
        const selectOptions: userSearch[] = response.users.map(
          (i: userSearch) => ({
            name: i.name,
            username: i.username,
          })
        );
        setOptions(selectOptions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filterBy = () => true;

  const sendToUserProfile = (username: string) => {
    history.push(`/profile/${username}`);
  };

  function ChangeSpaceComponent() {
    return (
      <>
        <select
          value={inSpaceUsers !== null && JSON.parse(inSpaceUsers).space.id}
          onChange={(e) => changeSpace(e.target.value)}
          className="form-select mb-2"
        >
          {inSpaceUsers !== null &&
            JSON.parse(inSpaceUsers).space_list.map((space: any) => (
              <option key={space[1]} value={space[1]}>
                {space[0]}
              </option>
            ))}
        </select>
        <div className="d-grid gap-2">
          <button
            type="button"
            onClick={() => getCurrentUsers()}
            className="btn btn-primary"
          >
            Refresh Space
          </button>
        </div>
      </>
    );
  }

  // @ts-ignore
  return (
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
        <Tab label="Dashboard" {...a11yProps(0)} />
        <Tab label="Search" {...a11yProps(1)} />
        <Tab label="New Training Session" {...a11yProps(2)} />
        <Tab label="Training Sessions" {...a11yProps(3)} />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ChangeSpaceComponent />
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
                JSON.parse(inSpaceUsers).space_users.map(
                  (dashboard_user: any) => (
                    <tr>
                      <td>
                        <p
                          onClick={() =>
                            sendToUserProfile(dashboard_user.username)
                          }
                        >
                          {dashboard_user.name}
                        </p>
                      </td>
                      <td>{dashboard_user.email}</td>
                      <td>{dashboard_user.flagged ? "Yes" : "No"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => signOutUser(dashboard_user.username)}
                          className="btn btn-danger"
                        >
                          Sign Out
                        </button>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ChangeSpaceComponent />
        <h3 className="text-center mt-2">Search Users</h3>

        <AsyncTypeahead
          id="search-users-typeahead"
          filterBy={filterBy}
          isLoading={isLoading}
          labelKey="name"
          minLength={3}
          onSearch={handleSearch}
          // @ts-ignore
          onChange={(e) => setTypeAheadValue(e[0].username)}
          options={options}
          placeholder="Search for a user..."
          renderMenuItemChildren={(selectedItem) => (
            // @ts-ignore
            <span>{selectedItem.name}</span>
          )}
        />

        <div className="row">
          <div className="col-md-6 mt-2">
            <div className="d-grid gap-2">
              <button
                type="button"
                onClick={() => getSearchedUsers(typeAheadValue)}
                className="btn btn-primary"
              >
                Search
              </button>
            </div>
          </div>
          <div className="col-md-6 mt-2">
            <div className="d-grid gap-2">
              <button
                type="button"
                onClick={() => signInUser(typeAheadValue)}
                className="btn btn-info"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        <br />

        <p className="text-center">Or</p>

        <input
          type="text"
          id="rounded-email"
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Username, Name"
          className="form-control mb-2"
        />
        <div className="d-grid gap-2">
          <button
            type="button"
            onClick={() => getSearchedUsers(value)}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
        {searchedUsers !== null && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Flagged?</th>
                  <th scope="col">Sign In</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(searchedUsers).map((dashboard_user: any) => (
                  <tr>
                    <td>
                      <div className="flex items-center">
                        <div
                          className="ml-3"
                          onClick={() =>
                            sendToUserProfile(dashboard_user.username)
                          }
                        >
                          {dashboard_user.name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-gray-900 whitespace-no-wrap">
                        {dashboard_user.email}
                      </p>
                    </td>
                    <td>{dashboard_user.flagged ? "Yes" : "No"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => signInUser(dashboard_user.username)}
                        className="btn btn-success"
                      >
                        Sign In
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ChangeSpaceComponent />
        <h3 className="text-center mt-2">Training Sessions</h3>
        <div>
          <div className="mb-3">
            <label className="form-label">Training</label>
            <select
              onChange={(e) => setTrainingId(e.target.value)}
              className="form-select mb-2"
            >
              {newTrainingSession !== null &&
                JSON.parse(newTrainingSession).trainings.map(
                  (training: any) => (
                    <option key={training[0]} value={training[0]}>
                      {training[1]}
                    </option>
                  )
                )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Level</label>
            <select
              onChange={(e) => setTrainingLevel(e.target.value)}
              className="form-select mb-2"
            >
              {newTrainingSession !== null &&
                JSON.parse(newTrainingSession).level.map((level: any) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Course</label>
            <select
              onChange={(e) => setTrainingCourse(e.target.value)}
              className="form-select mb-2"
            >
              {newTrainingSession !== null &&
                JSON.parse(newTrainingSession).course_names.map(
                  (course: any) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  )
                )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Instructor</label>
            <select
              onChange={(e) => setTrainingInstructor(e.target.value)}
              className="form-select mb-2"
            >
              {newTrainingSession !== null &&
                JSON.parse(newTrainingSession).admins.map((admin: any) => (
                  <option key={admin[0]} value={admin[0]}>
                    {admin[1]}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Users</label>

            <br />

            <Button variant="outlined" onClick={selectAllTrainingUsers}>
              Select All
            </Button>

            <FormGroup>
              {newTrainingSession !== null &&
                JSON.parse(newTrainingSession).users.map((user: any) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleCheckboxChange}
                        id={String(user[0])}
                        value={user[0]}
                        checked={trainingUsers.includes(String(user[0]))}
                      />
                    }
                    label={user[1]}
                  />
                ))}
            </FormGroup>
          </div>
          <Button variant="contained" onClick={startTraining}>
            Submit
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <ChangeSpaceComponent />
        <h3 className="text-center mt-2">My Training Sessions</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Training</th>
                <th scope="col">Space</th>
                <th scope="col">Course</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainingSessionsData !== null &&
                JSON.parse(trainingSessionsData).map((session: any) => (
                  <tr>
                    <td>
                      {new Date(Date.parse(session.updated_at)).toDateString()}
                    </td>
                    <td>{session.training.name}</td>
                    <td>{session.space.name}</td>
                    <td>{session.course}</td>
                    <td>
                      {session.certifications.length > 0
                        ? "Completed"
                        : "Not Completed"}
                    </td>
                    <td>
                      {session.certifications.length === 0 && (
                        <button
                          onClick={() => certifySession(session.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Certify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </TabPanel>
      <Toaster />
    </div>
  );
}

export default SpaceDashboard;
