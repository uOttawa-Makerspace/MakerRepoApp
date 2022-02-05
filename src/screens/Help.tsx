import React, {useContext, useState} from "react";
import env_variables from "../utils/env_variables";
import * as HTTPRequest from "../utils/HTTPRequests";
import LogoutIcon from '@mui/icons-material/Logout';
import {Button} from "@mui/material";
import {removeUserSession, setUserSession} from "../utils/Common";
import {LoggedInContext} from "../utils/Contexts";

const Help = (props: { history: string[]; }) => {
    const [errors, setErrors] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [emailSent, setEmailSent] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [comments, setComments] = useState("");
    const {loggedIn, setLoggedIn} = useContext(LoggedInContext);

    const handleLogout = () => {
        HTTPRequest.get('logout').then(
            () => {
                setLoggedIn(false);
                removeUserSession();
                props.history.push('/login');
            }
        ).catch((error) => {
            console.error(error);
        });
    }

    const formValidation = (validateList: string[][], formErrorFunction?: (value: (((prevState: any[]) => any[]) | any[])) => void) => {
        let errorsObject: { [key: string]: string } = {};
        validateList.forEach(item => {
            if (!item[1]) {
                errorsObject[item[0]] = `The ${item[0]} field is required`;
            }
        });
        if (formErrorFunction) {
            // @ts-ignore
            formErrorFunction(errorsObject);
        }
        return Object.keys(errorsObject).length === 0;
    }

    const sendSupportEmail = () => {
        const validateList = [['name', name], ['email', email], ['subject', subject], ['comments', comments]];
        // @ts-ignore
        if (formValidation(validateList, setFormErrors)) {
            HTTPRequest.put('send_email', {
                name: name,
                email: email,
                subject: subject,
                comments: comments,
                app_version: `${env_variables.config.app_version} ${env_variables.config.app_release_type}`,
            }).then(() => {
                setEmailSent(true);
                setErrors(false);
            }).catch(error => {
                setEmailSent(true);
                console.log(error);
                setErrors(true);
            });
        }
    }

    return (
        <div className="p-5p">
            <div className="py-4 text-center">
                <h2>MakerRepo App</h2>
                <p>Version {env_variables.config.app_version} {env_variables.config.app_release_type}</p>
            </div>
            <div>
                <h3 className="text-center py-1">You need help? Contact Us through this form!</h3>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="form-control" value={name}
                           onChange={e => setName(e.target.value)}/>
                    { formErrors.name &&
                        <div className="text-danger">{ formErrors.name }</div>
                    }
                </div>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" value={email}
                           onChange={e => setEmail(e.target.value)}/>
                    { formErrors.email &&
                        <div className="text-danger">{ formErrors.email }</div>
                    }
                </div>
                <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input type="text" name="text" className="form-control" value={subject}
                           onChange={e => setSubject(e.target.value)}/>
                    { formErrors.subject &&
                        <div className="text-danger">{ formErrors.subject }</div>
                    }
                </div>
                <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea name="comments" className="form-control" value={comments}
                              onChange={e => setComments(e.target.value)}/>
                    { formErrors.comments &&
                        <div className="text-danger">{ formErrors.comments }</div>
                    }
                </div>
                <Button variant="contained" onClick={sendSupportEmail}>Submit</Button>
            </div>
            <br />
            { emailSent && !errors &&
                <div className="alert alert-success">The help request has successfully been sent. You can expect an answer within 2 business days</div>
            }
            { emailSent && errors &&
            <div className="alert alert-danger">An error occurred while sending the email. Please try again later or contact uottawa.makerepo@gmail.com</div>
            }

            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
        </div>
    )
};

export default Help;