import {useEffect, useState} from "react";
import env_variables from "../utils/env_variables";
import {useHistory} from "react-router-dom";
import * as HTTPRequest from "../utils/HTTPRequests";
import {removeUserSession, setUserSession} from "../utils/Common";

const SpaceDashboard = () => {

    const history = useHistory();
    const [inSpaceUsers, setInSpaceUsers] = useState<string | null>(null);
    const [searchedUsers, setSearchedUsers] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUsers();
    }, []);

    const getCurrentUsers = () => {
        HTTPRequest.get('staff_dashboard').then(
            response => {
                setInSpaceUsers(JSON.stringify(response))
            }
        ).catch((error) => {
            console.error(error);
        });
    };

    const changeSpace = (space_id: number | string) => {
        fetch(`${env_variables.config.api_url}/staff_dashboard/change_space?space_id=${space_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json().then((data => {
                getCurrentUsers()
            })
        )).catch((error) => {
            console.error(error);
        });
    };

    const getSearchedUsers = () => {
        fetch(`${env_variables.config.api_url}/staff_dashboard/search?query=${value}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json().then((data => {
                setSearchedUsers(JSON.stringify(data))
            })
        )).catch((error) => {
            console.error(error);
        });
    };

    const signOutUser = (username: string) => {
        fetch(`${env_variables.config.api_url}/staff_dashboard/remove_users?dropped_users[]=${username}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(
            (data) => {
                getCurrentUsers()
            }
        ).catch((error) => {
            console.error(error);
        });
    };

    const signInUser = (username: string) => {
        fetch(`${env_variables.config.api_url}/staff_dashboard/add_users?added_users[]=${username}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(
            (data) => {
                getCurrentUsers();
                getSearchedUsers();
            }
        ).catch((error) => {
            console.error(error);
        });
    };

    const sendToUserProfile = (username: string) => {
        history.push(`/profile/${username}`);
    }

    return (
        <div>
            <div>
                <select value={inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space']['id']} onChange={e => changeSpace(e.target.value)} className="block w-52 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    { inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space_list'].map((space: any) => {
                        return (<option value={space[1]}>{space[0]}</option>)
                    })}
                </select>
            </div>
            <div>
                <div className="d-grid gap-2">
                        <button type="button" onClick={() => getCurrentUsers()}
                                className="btn btn-primary">
                            Refresh Space
                        </button>
                </div>
            </div>
            <div className="px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">
                                Name
                            </th>
                            <th scope="col">
                                Email
                            </th>
                            <th scope="col">
                                Flagged?
                            </th>
                            <th scope="col">
                                Sign Out
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space_users'].map((dashboard_user: any) => {
                            return (
                                <tr>
                                    <td>
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p onClick={() => sendToUserProfile(dashboard_user.username)}>
                                                    {dashboard_user.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {dashboard_user.email}
                                    </td>
                                    <td>
                                        {dashboard_user.flagged ? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => signOutUser(dashboard_user.username)}
                                                className="btn btn-danger">
                                            Sign Out
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="relative">
                <input type="text" id="rounded-email" onChange={e => setValue(e.target.value)}
                       className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="Username, Name"/>
            </div>
            <div className="d-grid gap-2">
                <button type="button" onClick={() => getSearchedUsers()}
                        className="btn btn-primary">
                    Search
                </button>
            </div>

            {searchedUsers !== null &&
            <div className="px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">
                                Name
                            </th>
                            <th scope="col">
                                Email
                            </th>
                            <th scope="col">
                                Flagged?
                            </th>
                            <th scope="col">
                                Sign In
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {JSON.parse(searchedUsers).map((dashboard_user: any) => {
                            return (
                                <tr>
                                    <td>
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                {dashboard_user.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {dashboard_user.email}
                                        </p>
                                    </td>
                                    <td>
                                        {dashboard_user.flagged ? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => signInUser(dashboard_user.username)}
                                                className="btn btn-success">
                                            Sign In
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            }
        </div>
    )
}

export default SpaceDashboard;