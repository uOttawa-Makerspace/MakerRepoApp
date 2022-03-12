import React, { useEffect, useState } from "react";
import "../utils/EnvVariables";
import SpaceDashboard from "./SpaceDashboard";
import { getUser, removeUserSession, setUserSession } from "../utils/Common";
import SpaceHours from "./SpaceHours";
import * as HTTPRequest from "../utils/HTTPRequests";

function Home(props: { history: string[] }) {
  const [user, setUser] = useState<{ [key: string]: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    HTTPRequest.get("logout")
      .then(() => {
        removeUserSession();
        props.history.push("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {user && (
        <>
          <h1 className="text-center">Hello {user.name}</h1>
          {user.role === "admin" ? <SpaceDashboard /> : <SpaceHours />}
          <br />
        </>
      )}
    </div>
  );
}

export default Home;
