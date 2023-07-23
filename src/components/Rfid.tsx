import React, { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import * as HTTPRequest from "../utils/HTTPRequests";

interface RfidStatus {
  status: "error" | "warning" | "success";
  message: string;
}

interface RfidProps {
  spaceId: number | undefined;
}

const Rfid = ({ spaceId }: RfidProps) => {
  const [scanRfid, setScanRfid] = useState<boolean>(false);
  const [status, setStatus] = useState<null | RfidStatus>(null);

  const setErrorStatus = () => {
    setStatus({
      status: "error",
      message:
        "An error has occurred... Please make sure the card is registered",
    });
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setStatus(null);
  };

  const handleRfidCardTap = (rfidCardNumber: string) => {
    HTTPRequest.post("/rfid/card_number", {
      rfid: rfidCardNumber,
      space_id: spaceId,
    })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.success === "RFID sign out") {
              setStatus({ status: "warning", message: "Signed Out!" });
            } else {
              setStatus({ status: "success", message: "Signed In!" });
            }
          } else {
            setErrorStatus();
          }
        } else {
          setErrorStatus();
        }
      })
      .catch(() => {
        setErrorStatus();
      });
  };

  const startScanning = async () => {
    if (!scanRfid) {
      try {
        // eslint-disable-next-line no-undef
        const ndef = new NDEFReader();
        await ndef.scan();
        setScanRfid(true);
        // @ts-ignore
        ndef.addEventListener("reading", ({ serialNumber }) => {
          if (serialNumber) {
            handleRfidCardTap(serialNumber.replaceAll(":", "").toUpperCase());
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    } else {
      setScanRfid(false);
    }
  };

  return (
    <div>
      {"NDEFReader" in window && (
        <div className="justify-content-center">
          <div className="d-grid gap-2 my-2">
            <button
              type="button"
              onClick={() => startScanning()}
              disabled={scanRfid}
              className="btn btn-info text-white"
            >
              {scanRfid ? "Scanning..." : "Start Scanning"}
            </button>
          </div>
          <Snackbar
            open={!!status}
            autoHideDuration={5000}
            onClose={handleSnackBarClose}
          >
            <Alert
              sx={{ width: "100%" }}
              severity={status?.status}
              className="justify-content-center mt-2"
            >
              {status?.message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </div>
  );
};

export default Rfid;
