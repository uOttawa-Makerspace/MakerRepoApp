import { useState } from "react";
import { Alert, Button } from "@mui/material";
import NfcIcon from "@mui/icons-material/Nfc";
import * as HTTPRequest from "../utils/HTTPRequests";

interface RfidStatus {
  status: "error" | "warning" | "success";
  message: string;
}

interface RfidProps {
  spaceId: string | number | undefined;
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
            <Button
              variant="contained"
              size="large"
              onClick={() => startScanning()}
              disabled={scanRfid}
              startIcon={<NfcIcon />}
              sx={{
                py: 2,
                fontSize: "1.25rem",
                fontWeight: "bold",
                letterSpacing: 1,
                backgroundColor: scanRfid ? "grey.500" : "info.main",
                "&:hover": {
                  backgroundColor: "info.dark",
                },
                animation: scanRfid
                  ? "pulse 1.5s ease-in-out infinite"
                  : "none",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.6 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              {scanRfid ? "Scanning..." : "Start Scanning"}
            </Button>
          </div>
          {!!status && (
            <Alert
              onClose={() => setStatus(null)}
              severity={status?.status}
              className="justify-content-center mt-2"
            >
              {status?.message}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default Rfid;