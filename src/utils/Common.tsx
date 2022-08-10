export const getUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

export const getToken = () => localStorage.getItem("token") || null;

export const removeUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const setUserSession = (token: string, user: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
