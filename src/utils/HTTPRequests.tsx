import axios from "axios";
import { Notifier } from "@airbrake/browser";
import EnvVariables from "./EnvVariables";

export const airbrake = () =>
  new Notifier({
    projectId: 441678,
    projectKey: "b19323e1288e612e00fc65acf1369c5c",
  });

const notifyAndReturn = (error: Error, route: string) => {
  airbrake().notify({ error, info: { route } });
};

export const get = (route: string) =>
  axios
    .get(`${EnvVariables.api_url}/${route}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      notifyAndReturn(error, route);
      return error;
    });

export const patch = (route: string, body: any) =>
  axios
    .patch(`${EnvVariables.api_url}/${route}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
    .then((response) => response.data)
    .catch((error) => {
      notifyAndReturn(error, route);
      return error;
    });

export const put = (route: string, body: any) =>
  axios
    .put(`${EnvVariables.api_url}/${route}`, body, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      notifyAndReturn(error, route);
      return error;
    });

export const post = (route: string, body: any) =>
  axios
    .post(`${EnvVariables.api_url}/${route}`, body, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then((response) => response)
    .catch((error) => {
      notifyAndReturn(error, route);
      return error;
    });
