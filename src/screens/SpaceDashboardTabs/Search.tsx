import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useHistory } from "react-router-dom";
import * as HTTPRequest from "../../utils/HTTPRequests";

type SearchProps = {
  handleReloadCurrentUsers: () => void;
};

interface userSearch {
  name: string;
  username: string;
}

const Search = ({ handleReloadCurrentUsers }: SearchProps) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<userSearch[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const [typeAheadValue, setTypeAheadValue] = useState<string>("");

  const filterBy = () => true;

  const handleSearch = (query: string) => {
    setIsLoading(true);

    HTTPRequest.get(`staff_dashboard/populate_users?search=${query}`)
      .then((response) => {
        const selectOptions: userSearch[] = response.users.map(
          (i: userSearch) => ({
            name: i.name,
            username: i.username,
          })
        );
        setOptions(selectOptions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signInUser = (username: string) => {
    HTTPRequest.put(`staff_dashboard/add_users?added_users=${username}`, {})
      .then(() => {
        handleReloadCurrentUsers();
        toast.success(`${username} has successfully been signed in!`, {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSearchedUsers = (searchValue: string) => {
    HTTPRequest.get(`staff_dashboard/search?query=${searchValue}`)
      .then((response) => {
        setSearchedUsers(JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendToUserProfile = (username: string) => {
    history.push(`/profile/${username}`);
  };

  return (
    <>
      <h3 className="text-center mt-2">Search Users</h3>

      <AsyncTypeahead
        id="search-users-typeahead"
        filterBy={filterBy}
        isLoading={isLoading}
        labelKey="name"
        minLength={3}
        onSearch={handleSearch}
        // @ts-ignore
        onChange={(e) => setTypeAheadValue(e[0].username)}
        options={options}
        placeholder="Search for a user..."
        renderMenuItemChildren={(selectedItem) => (
          // @ts-ignore
          <span>{selectedItem.name}</span>
        )}
      />

      <div className="row">
        <div className="col-md-6 mt-2">
          <div className="d-grid gap-2">
            <button
              type="button"
              onClick={() => getSearchedUsers(typeAheadValue)}
              className={`btn btn-primary ${
                typeAheadValue === "" ? "disabled" : ""
              }`}
              disabled={typeAheadValue === ""}
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-md-6 mt-2">
          <div className="d-grid gap-2">
            <button
              type="button"
              onClick={() => signInUser(typeAheadValue)}
              className={`btn btn-primary ${
                typeAheadValue === "" ? "disabled" : ""
              }`}
              disabled={typeAheadValue === ""}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <br />

      <p className="text-center">Or</p>

      <input
        type="text"
        id="rounded-email"
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Username, Name"
        className="form-control mb-2"
      />
      <div className="d-grid gap-2">
        <button
          type="button"
          onClick={() => getSearchedUsers(value)}
          className={`btn btn-primary ${value === "" ? "disabled" : ""}`}
          disabled={value === ""}
        >
          Search
        </button>
      </div>
      {searchedUsers !== null && (
        <div className="table-responsive mt-2">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Flagged?</th>
                <th scope="col">Sign In</th>
              </tr>
            </thead>
            <tbody>
              {JSON.parse(searchedUsers).map((searchedUser: any) => (
                <tr>
                  <td>
                    <div className="flex items-center">
                      <div
                        className="ml-3"
                        onClick={() => sendToUserProfile(searchedUser.username)}
                      >
                        {searchedUser.name}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-gray-900 whitespace-no-wrap">
                      {searchedUser.email}
                    </p>
                  </td>
                  <td>{searchedUser.flagged ? "Yes" : "No"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => signInUser(searchedUser.username)}
                      className="btn btn-success"
                    >
                      Sign In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Search;
