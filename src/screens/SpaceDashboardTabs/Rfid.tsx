import React, { useState } from "react";
import { Alert } from "@mui/material";
import * as HTTPRequest from "../../utils/HTTPRequests";

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

  const handleRfidCardTap = (rfidCardNumber: string) => {
    HTTPRequest.post("/rfid/card_number", {
      rfid: rfidCardNumber,
      space_id: spaceId,
    })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.success === "RFID sign out") {
              setStatus({ status: "warning", message: "Signed In!" });
            } else {
              setStatus({ status: "success", message: "Signed Out!" });
            }
          } else {
            setStatus({
              status: "error",
              message:
                "An error has occurred... Please make sure the card is registered",
            });
          }
        }
      })
      .catch(() => {
        setStatus({
          status: "error",
          message:
            "An error has occurred... Please make sure the card is registered",
        });
      });
  };

  const startStopScanning = async () => {
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
      setScanRfid(true);
    }
  };

  return (
    <div>
      {"NDEFReader" in window && (
        <div className="justify-content-center">
          <button
            type="button"
            onClick={() => startStopScanning()}
            className="btn btn-primary btn-sm"
          >
            {scanRfid ? "Stop" : "Start"} Scanning
          </button>
          {status && (
            <Alert
              severity={status.status}
              className="justify-content-center mt-2"
            >
              {status.message}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default Rfid;
