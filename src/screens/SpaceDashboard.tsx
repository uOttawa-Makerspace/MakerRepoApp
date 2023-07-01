import React, { useEffect, useState } from "react";
import { Button, Tab, Tabs } from "@mui/material";
import * as HTTPRequest from "../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../components/TabPanel";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Dashboard from "./SpaceDashboardTabs/Dashboard";
import Search from "./SpaceDashboardTabs/Search";
import NewTrainingSession from "./SpaceDashboardTabs/NewTrainingSession";
import TrainingSessions from "./SpaceDashboardTabs/TrainingSessions";
import ChangeSpace from "../components/ChangeSpace";

function SpaceDashboard() {
  const [inSpaceUsers, setInSpaceUsers] = useState<any>(null);
  const [trainingSessions, setTrainingSessions] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [rfid, setRfid] = useState<string | null>(null);

  const startScanning = async () => {
    try {
      // eslint-disable-next-line no-undef
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        setRfid(serialNumber);
      });
    } catch (error) {
      console.log(`Error! Scan failed to start: ${error}.`);
    }
  };

  const handleTabChange = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    getCurrentUsers();
    getTrainingSessions();
  }, []);

  const getCurrentUsers = () => {
    HTTPRequest.get("staff_dashboard")
      .then((response) => {
        setInSpaceUsers(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTrainingSessions = () => {
    HTTPRequest.get("staff/training_sessions")
      .then((response) => {
        setTrainingSessions(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // @ts-ignore
  return (
    <div className="w-100vh">
      <Tabs
        style={{ width: "100vw" }}
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Dashboard" {...a11yProps(0)} />
        <Tab label="Search" {...a11yProps(1)} />
        <Tab label="New Training Session" {...a11yProps(2)} />
        <Tab label="Training Sessions" {...a11yProps(3)} />
        <Tab label="RFID" {...a11yProps(4)} />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ChangeSpace
          inSpaceUsers={inSpaceUsers}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
        <Dashboard
          inSpaceUsers={inSpaceUsers !== null ? inSpaceUsers?.space_users : []}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ChangeSpace
          inSpaceUsers={inSpaceUsers}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
        <Search handleReloadCurrentUsers={() => getCurrentUsers()} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ChangeSpace
          inSpaceUsers={inSpaceUsers}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
        <NewTrainingSession
          spaceId={inSpaceUsers !== null ? inSpaceUsers?.space?.id : null}
          reloadTrainingSessions={() => getTrainingSessions()}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <ChangeSpace
          inSpaceUsers={inSpaceUsers}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
        <TrainingSessions
          trainingSessions={trainingSessions}
          reloadTrainingSessions={() => getTrainingSessions()}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={4}>
        {"NDEFReader" in window && (
          <div>
            NFC
            <button
              type="button"
              onClick={() => startScanning()}
              className="btn btn-primary btn-sm"
            >
              Start Scanning
            </button>
            {rfid ?? "Not scanned yet"}
          </div>
        )}
      </TabPanel>
    </div>
  );
}

export default SpaceDashboard;
