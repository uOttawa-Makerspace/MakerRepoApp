import axios from "axios";
import EnvVariables from "./EnvVariables";

export const get = (route: string) =>
  axios
    .get(`${EnvVariables.config.api_url}/${route}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => error);

export const patch = (route: string, body: any) =>
  axios
    .patch(`${EnvVariables.config.api_url}/${route}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
    .then((response) => response.data)
    .catch((error) => error);

export const put = (route: string, body: any) =>
  axios
    .put(`${EnvVariables.config.api_url}/${route}`, body, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);

export const post = (route: string, body: any) =>
  axios
    .post(`${EnvVariables.config.api_url}/${route}`, body, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => response)
    .catch((error) => error);
