import { Redirect } from "react-router-dom";
import React, { cloneElement } from "react";

const PrivateRoute = ({ children, user }: any) => {
  const token = localStorage.getItem("token");
  return token ? (
    cloneElement(children, { user })
  ) : (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};

export default PrivateRoute;
