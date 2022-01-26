export const getUser = () => {
    const userStr = window.localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    } else {
        return null;
    }
}

export const getToken = () => {
    return window.localStorage.getItem('token') || null;
}

export const removeUserSession = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
}

export const setUserSession = (token: string, user: string) => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
}
