import React, { useContext, useState } from "react";
import { setUserSession } from "../utils/Common";
import logo from "../assets/logo192.png";
import { LoggedInContext } from "../utils/Contexts";
import * as HTTPRequest from "../utils/HTTPRequests";

function Login(props: { history: string[] }) {
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

  const handleLogin = () => {
    HTTPRequest.post("login_authentication", {
      username_email: usernameEmail,
      password: password,
    })
      .then((response) => {
        if (response.status === 200) {
          setUserSession(response.data.token, response.data.user);
          setLoggedIn(true);
          setLoginError(false);
          props.history.push("/");
        } else {
          setLoggedIn(false);
          setLoginError(true);
        }
      })
      .catch((error) => {
        setLoggedIn(false);
        setLoginError(true);
        console.log("Something went wrong. Please try again later.", error);
      });
  };

  return (
    <div className="v-center">
      <div className="d-block">
        <div className="text-center">
          <img src={logo} width={55} height={55} alt="MakeRepo Logo" />
          <h5 className="m-2">Login</h5>
        </div>
        {loginError && (
          <div className="alert alert-danger">
            Invalid username or password.
          </div>
        )}
        <div className="mb-3">
          <input
            type="text"
            value={usernameEmail}
            onChange={(e) => setUsernameEmail(e.target.value)}
            name="username_email"
            className="form-control"
            placeholder="Email / Username"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="form-control"
            placeholder="Password"
          />
          <a
            href="https://makerepo.com/forgot_password"
            target="_blank"
            rel="noreferrer"
          >
            Forgot Your Password?
          </a>
        </div>
        <div className="mb-3">
          <div className="d-grid gap-2">
            <button
              type="button"
              onClick={handleLogin}
              className="btn btn-primary"
            >
              Login
            </button>
          </div>
        </div>
        <a href="https://makerepo.com/new" target="_blank" rel="noreferrer">
          <span className="">You don't have an account?</span>
        </a>
      </div>
    </div>
  );
}

export default Login;