import React, {createContext, Dispatch, SetStateAction} from "react";

interface LoggedInContextProps {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const LoggedInContext = createContext<LoggedInContextProps>({
    loggedIn: false,
    setLoggedIn: () => {}
});