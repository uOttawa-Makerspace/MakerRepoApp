import { Redirect } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? (
    children
  ) : (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};

export default PrivateRoute;
