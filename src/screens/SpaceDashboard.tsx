import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import * as HTTPRequest from "../utils/HTTPRequests";

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
        HTTPRequest.put(`staff_dashboard/change_space?space_id=${space_id}`, {}).then(() => {
            getCurrentUsers()
        }).catch(error => {
            console.log(error);
        });
    };

    const getSearchedUsers = () => {
        HTTPRequest.get(`staff_dashboard/search?query=${value}`).then(
            response => {
                setSearchedUsers(JSON.stringify(response))
            }
        ).catch((error) => {
            console.error(error);
        });
    };

    const signOutUser = (username: string) => {
        HTTPRequest.put(`staff_dashboard/remove_users?dropped_users[]=${username}`, {}).then(() => {
            getCurrentUsers()
        }).catch(error => {
            console.log(error);
        });
    };

    const signInUser = (username: string) => {
        HTTPRequest.put(`staff_dashboard/add_users?added_users=${username}`, {}).then(() => {
            getCurrentUsers();
            getSearchedUsers();
        }).catch(error => {
            console.log(error);
        });
    };

    const sendToUserProfile = (username: string) => {
        history.push(`/profile/${username}`);
    }

    return (
        <div className="w-100vh">
            <select value={inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space']['id']}
                    onChange={e => changeSpace(e.target.value)} className="form-select mb-2">
                {inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space_list'].map((space: any) => {
                    return (<option value={space[1]}>{space[0]}</option>)
                })}
            </select>
            <div className="d-grid gap-2">
                <button type="button" onClick={() => getCurrentUsers()}
                        className="btn btn-primary">
                    Refresh Space
                </button>
            </div>
            <h3 className="text-center mt-2">Signed In Users</h3>
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
                                    <p onClick={() => sendToUserProfile(dashboard_user.username)}>
                                        {dashboard_user.name}
                                    </p>
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

            <h3 className="text-center mt-2">Search Users</h3>

            <input type="text" id="rounded-email" onChange={e => setValue(e.target.value)}
                   placeholder="Username, Name" className="form-control mb-2" />
            <div className="d-grid gap-2">
                <button type="button" onClick={() => getSearchedUsers()}
                        className="btn btn-primary">
                    Search
                </button>
            </div>

            {searchedUsers !== null &&
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
            }
        </div>
    )
}

export default SpaceDashboard;