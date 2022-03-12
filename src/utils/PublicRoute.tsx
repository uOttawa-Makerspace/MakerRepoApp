import React from "react";
import { Route } from "react-router-dom";

const PublicRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PublicRoute;
