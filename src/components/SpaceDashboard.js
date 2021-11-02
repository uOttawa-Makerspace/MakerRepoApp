import {UserContext} from "../contexts/UserContext";
import {useContext, useEffect, useState} from "react";
import env_variables from "../env_variables";
import {useHistory} from "react-router-dom/cjs/react-router-dom";

const SpaceDashboard = () => {

    const {user, setUser} = useContext(UserContext);
    const history = useHistory();
    const [inSpaceUsers, setInSpaceUsers] = useState(null);
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        getCurrentUsers();
    });

    const getCurrentUsers = () => {
        fetch(`${env_variables.config.api_url}/staff_dashboard`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json().then((data => {
                setInSpaceUsers(JSON.stringify(data))
            })
        )).catch((error) => {
            console.error(error);
        });
    };

    const changeSpace = (space_id) => {
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

    const signOutUser = (username) => {
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

    const signInUser = (username) => {
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

    const sendToUserProfile = (username) => {
        history.push(`/profile/${username}`);
    }

    return (
        <div>
            <div>
                <select value={inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space']['id']} onChange={e => changeSpace(e.target.value)} className="block w-52 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    { inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space_list'].map((space) => {
                        return (<option value={space[1]}>{space[0]}</option>)
                    })}
                </select>
            </div>
            <div>
                <div className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <button type="button" onClick={() => getCurrentUsers()}
                                className="py-2 px-4 bg-primary focus:ring-primary text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ">
                            Refresh Space
                        </button>
                </div>
            </div>
            <div className="px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Name
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Email
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Flagged?
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Sign Out
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {inSpaceUsers !== null && JSON.parse(inSpaceUsers)['space_users'].map((dashboard_user) => {
                            return (
                                <tr>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p onClick={() => sendToUserProfile(dashboard_user.username)} className="text-gray-900 whitespace-no-wrap">
                                                    {dashboard_user.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {dashboard_user.email}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {dashboard_user.flagged ? 'Yes' : 'No'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button type="button" onClick={() => signOutUser(dashboard_user.username)}
                                                className="py-2 px-4 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ">
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
            <button type="button" onClick={() => getSearchedUsers()}
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                Search
            </button>

            <div className="px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Name
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Email
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Flagged?
                            </th>
                            <th scope="col"
                                className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm font-normal">
                                Sign In
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchedUsers !== null && JSON.parse(searchedUsers).map((dashboard_user) => {
                            return (
                                <tr>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {dashboard_user.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {dashboard_user.email}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {dashboard_user.flagged ? 'Yes' : 'No'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button type="button" onClick={() => signInUser(dashboard_user.username)}
                                                className="py-2 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ">
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

        </div>
    )
}

export default SpaceDashboard;