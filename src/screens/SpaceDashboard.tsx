import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import * as HTTPRequest from "../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../components/TabPanel";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Dashboard from "./SpaceDashboardTabs/Dashboard";
import Search from "./SpaceDashboardTabs/Search";
import NewTrainingSession from "./SpaceDashboardTabs/NewTrainingSession";
import TrainingSessions from "./SpaceDashboardTabs/TrainingSessions";

function SpaceDashboard() {
  const [inSpaceUsers, setInSpaceUsers] = useState<any>(null);
  const [trainingSessions, setTrainingSessions] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = React.useState(0);

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

  const changeSpace = (spaceId: number | string) => {
    HTTPRequest.put(`staff_dashboard/change_space?space_id=${spaceId}`, {})
      .then(() => {
        getCurrentUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function ChangeSpaceComponent() {
    return (
      <>
        <select
          value={inSpaceUsers !== null && inSpaceUsers?.space?.id}
          onChange={(e) => changeSpace(e.target.value)}
          className="form-select mb-2"
        >
          {inSpaceUsers !== null &&
            inSpaceUsers?.space_list?.map((space: any) => (
              <option key={space[1]} value={space[1]}>
                {space[0]}
              </option>
            ))}
        </select>
        <div className="d-grid gap-2">
          <button
            type="button"
            onClick={() => getCurrentUsers()}
            className="btn btn-primary"
          >
            Refresh Space
          </button>
        </div>
      </>
    );
  }

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
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ChangeSpaceComponent />
        <Dashboard
          inSpaceUsers={inSpaceUsers !== null ? inSpaceUsers?.space_users : []}
          handleReloadCurrentUsers={() => getCurrentUsers()}
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ChangeSpaceComponent />
        <Search handleReloadCurrentUsers={() => getCurrentUsers()} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ChangeSpaceComponent />
        <NewTrainingSession
          spaceId={inSpaceUsers !== null ? inSpaceUsers?.space?.id : null}
          reloadTrainingSessions={() => getTrainingSessions()}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <ChangeSpaceComponent />
        <TrainingSessions
          trainingSessions={trainingSessions}
          reloadTrainingSessions={() => getTrainingSessions()}
        />
      </TabPanel>
    </div>
  );
}

export default SpaceDashboard;
