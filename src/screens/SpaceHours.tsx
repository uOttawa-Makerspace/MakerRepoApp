import React, {useEffect, useState} from "react";
import {SpaceHourCard} from "../components/SpaceHourCard";
import axios from "axios";
import env_variables from "../utils/env_variables";

const SpaceHours = () => {

    const [hours, setHours] = useState<any>(null);
    const [errors, setErrors] = useState(false);

    const getHours = () => {
        axios.get(`${env_variables.config.api_url}/hours`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setHours(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getHours()
    }, []);

    return (
        <div>
            Space Hours

            { !errors && hours
                ? <div>
                    {hours.map((hour: any, index: number | null) => (
                        <SpaceHourCard hour={hour} key={index} />
                    ))}
                </div>
                : <div>
                    <SpaceHourCard hour={{}} />
                    <SpaceHourCard hour={{}} />
                </div>
            }
        </div>
    )
};

export default SpaceHours;