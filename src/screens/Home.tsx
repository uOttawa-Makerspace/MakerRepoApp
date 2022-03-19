import React, { useEffect, useState } from "react";
import "../utils/EnvVariables";
import SpaceDashboard from "./SpaceDashboard";
import { getUser } from "../utils/Common";
import SpaceHours from "./SpaceHours";

function Home() {
  const [user, setUser] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

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
