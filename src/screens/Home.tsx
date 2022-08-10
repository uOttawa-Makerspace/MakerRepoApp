import React from "react";
import "../utils/EnvVariables";
import SpaceDashboard from "./SpaceDashboard";
import SpaceHours from "./SpaceHours";

interface HomeProps {
  user: Record<string, any>;
}

function Home({ user }: HomeProps) {
  return (
    <div>
      {user && (
        <>
          <h1 className="text-center">Hello {user.name}</h1>
          {user.role === "admin" || user.role === "staff" ? (
            <SpaceDashboard />
          ) : (
            <SpaceHours />
          )}
          <br />
        </>
      )}
    </div>
  );
}

export default Home;
