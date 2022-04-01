import React from "react";
import toast, { Toaster } from "react-hot-toast";
import * as HTTPRequest from "../../utils/HTTPRequests";

type TrainingSessionsProps = {
  trainingSessions: any;
  reloadTrainingSessions: () => void;
};

const TrainingSessions = ({
  trainingSessions,
  reloadTrainingSessions,
}: TrainingSessionsProps) => {
  const certifySession = (trainingSessionId: string) => {
    HTTPRequest.post(
      `staff/training_sessions/${trainingSessionId}/certify_trainees`,
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
          reloadTrainingSessions();
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

  return (
    <>
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
            {trainingSessions !== null &&
              trainingSessions.map((session: any) => (
                <tr key={session.id}>
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
      <Toaster />
    </>
  );
};

export default TrainingSessions;
