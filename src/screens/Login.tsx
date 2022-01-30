import React, {useContext, useState} from "react";
import env_variables from "../utils/env_variables";
import axios from "axios";
import {setUserSession} from "../utils/Common";
import logo from '../assets/makerepo-logo.jpg';
import {LoggedInContext} from "../utils/Contexts";

function Login(props: { history: string[]; }) {

    const [usernameEmail, setUsernameEmail] = useState('')
    const [password, setPassword] = useState('')
    const {loggedIn, setLoggedIn} = useContext(LoggedInContext);

    const handleLogin = () => {
        axios.post(`${env_variables.config.api_url}/login_authentication`, {
                username_email: usernameEmail,
                password: password
            },
            {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => {
            setUserSession(response.data.token, response.data.user);
            setLoggedIn(true);
            props.history.push('/');
        }).catch(error => {
            setLoggedIn(false);
            console.log("Something went wrong. Please try again later.")
        });
    }

    return (
        <div className="v-center">
            <div className="d-block">
                <div className="text-center">
                    <img src={logo} alt="MakeRepo Logo"/>
                    <h5 className="m-2">
                        Login
                    </h5>
                </div>
                <div className="mb-3">
                    <input type="text" value={usernameEmail}
                           onChange={e => setUsernameEmail(e.target.value)} name="username_email"
                           className="form-control"
                           placeholder="Email / Username"/>
                </div>
                <div className="mb-3">
                    <input type="password" value={password}
                           onChange={e => setPassword(e.target.value)} name="password"
                           className="form-control"
                           placeholder="Password"/>
                    <a href="https://makerepo.com/forgot_password" target="_blank" rel="noreferrer">
                        Forgot Your Password?
                    </a>
                </div>
                <div className="mb-3">
                    <div className="d-grid gap-2">
                        <button type="button" onClick={handleLogin} className="btn btn-primary">
                            Login
                        </button>
                    </div>

                </div>
                <a href="https://makerepo.com/new" target="_blank" rel="noreferrer">
                    <span className="">
                        You don't have an account?
                    </span>
                </a>
            </div>
        </div>
    )
};

export default Login;