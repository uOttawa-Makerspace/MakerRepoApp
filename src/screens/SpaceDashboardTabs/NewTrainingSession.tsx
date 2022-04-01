import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import { useHistory } from "react-router-dom";

type TrainingSessionsProps = {
  spaceId: number | string | null;
  reloadTrainingSessions: () => void;
};

const NewTrainingSession = ({
  spaceId,
  reloadTrainingSessions,
}: TrainingSessionsProps) => {
  const history = useHistory();

  const [newTrainingSession, setNewTrainingSession] = useState<string | null>(
    null
  );
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [trainingLevel, setTrainingLevel] = useState<string | null>(null);
  const [trainingCourse, setTrainingCourse] = useState<string | null>(null);
  const [trainingInstructor, setTrainingInstructor] = useState<string>("");
  const [trainingUsers, setTrainingUsers] = useState<string[]>([]);

  useEffect(() => {
    getNewTrainingSession();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let trainingUsersArray = [...trainingUsers, event.target.id];
    if (trainingUsers.includes(event.target.id)) {
      trainingUsersArray = trainingUsersArray.filter(
        (u) => u !== event.target.id
      );
    }
    setTrainingUsers(trainingUsersArray);
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

  const selectAllTrainingUsers = () => {
    if (newTrainingSession !== null) {
      const trainingUsersArray = JSON.parse(newTrainingSession).users.map(
        (u: any[]) => String(u[0])
      );
      setTrainingUsers(trainingUsersArray);
    }
  };

  const startTraining = () => {
    if (spaceId !== null) {
      HTTPRequest.post("staff/training_sessions", {
        training_session: {
          space_id: spaceId,
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
          reloadTrainingSessions();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <h3 className="text-center mt-2">Training Sessions</h3>
      <div>
        <div className="mb-3">
          <label className="form-label">Training</label>
          <select
            onChange={(e) => setTrainingId(e.target.value)}
            className="form-select mb-2"
          >
            {newTrainingSession !== null &&
              JSON.parse(newTrainingSession).trainings.map((training: any) => (
                <option key={training[0]} value={training[0]}>
                  {training[1]}
                </option>
              ))}
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
              JSON.parse(newTrainingSession).course_names.map((course: any) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
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
      <Toaster />
    </>
  );
};

export default NewTrainingSession;
