import axios from "axios";
import env_variables from "./env_variables";

export const get = (route: string) => {
    return axios.get(`${env_variables.config.api_url}/${route}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        }
    }).then(response => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}

export const patch = (route: string, body: any ) => {
    return axios.patch(`${env_variables.config.api_url}/${route}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}

export const put = (route: string, body: any) => {
    return axios.put(`${env_variables.config.api_url}/${route}`, body,{
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}

export const post = (route: string, body: any) => {
    return axios.post(`${env_variables.config.api_url}/${route}`, body, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}