import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext";
import {useParams} from "react-router-dom/cjs/react-router-dom";
import env_variables from "../env_variables";

const Profile = () => {
    const {user, setUser} = useContext(UserContext);
    const [profileUser, setProfileUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [rfid, setRfid] = useState(null);
    let {username} = useParams();

    // useEffect(() => {
    //     getProfile();
    // });
    //
    // const getProfile = () => {
    //     fetch(`${env_variables.config.api_url}/${username}`, {
    //         method: 'GET',
    //         credentials: 'include',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then(response => response.json().then((data => {
    //             setProfileUser(data.user)
    //             setProfile(JSON.stringify(data))
    //         })
    //     )).catch((error) => {
    //         console.error(error);
    //     });
    // };

    async function getRfid() {
        if ("NDEFReader" in window) {
            try {
                /*global NDEFReader*/
                const ndef = new NDEFReader();
                await ndef.scan();
                console.log("> Scan started");

                ndef.addEventListener("readingerror", () => {
                    console.log("Argh! Cannot read data from the NFC tag. Try another one?");
                });

                ndef.addEventListener("reading", ({message, serialNumber}) => {
                    console.log(`> Serial Number: ${serialNumber}`);
                    console.log(`> Records: (${message.records.length})`);
                    setRfid(serialNumber);
                });
            } catch (error) {
                console.log("Argh! " + error);
            }
        }
    }

    return (
        <div>
            {/*{profileUser == null || profile == null ?*/}
            {/*    <div>Loading ...</div>*/}
            {/*    :*/}
            {/*    <div>*/}
            {/*        This is the Profile for {profileUser.name}*/}
            {/*        <p>*/}
            {/*            {JSON.stringify(profile)}*/}
            {/*        </p>*/}
            {/*        <button onClick={() => getRfid()}>Scan RFID</button>*/}
            {/*        {rfid}*/}
            {/*    </div>*/}
            {/*}*/}
            <button onClick={() => getRfid()}>Scan RFID</button>
            {rfid}
        </div>
    )
}

export default Profile;