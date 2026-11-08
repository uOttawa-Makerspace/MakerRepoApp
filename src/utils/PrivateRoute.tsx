import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoggedInContext } from "./Contexts";

// Follows the auth state held in App, so a session that ends mid-use (failed token refresh,
// logout in another tab) sends the user to the login screen straight away.
const PrivateRoute = ({ children }: any) => {
  const { loggedIn } = useContext(LoggedInContext);
  return loggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
