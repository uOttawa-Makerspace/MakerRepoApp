import React, { memo, useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Nfc as NfcIcon,
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";
import ChangeSpace from "../../../components/ChangeSpace";
import { User, RfidInfo } from "../types";

interface RfidTabProps {
  tabIndex: number;
  panelIndex: number;
  user: User;
  rfidList: RfidInfo[];
  inSpaceUsers: any;
  onLinkRfid: (cardNumber: string) => Promise<void>;
  onOpenUnlinkDialog: (cardNumber: string) => void;
  onReloadCurrentUsers: () => void;
}

const LinkedCard: React.FC<{
  cardNumber: string;
  onUnlink: (cardNumber: string) => void;
}> = memo(({ cardNumber, onUnlink }) => (
  <Alert
    severity="success"
    icon={<CheckCircleIcon />}
    action={
      <Button
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => onUnlink(cardNumber)}
      >
        Remove
      </Button>
    }
  >
    <Typography variant="body2" fontWeight={600}>
      RFID Card Linked
    </Typography>
    <Typography variant="caption">Card Number: {cardNumber}</Typography>
  </Alert>
));

LinkedCard.displayName = "LinkedCard";

const AvailableCardItem: React.FC<{
  rfid: RfidInfo;
  onLink: (cardNumber: string) => void;
}> = memo(({ rfid, onLink }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="body2" fontWeight={600}>
          Card: {rfid.cardNumber}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Tapped: {rfid.tappedAt}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => onLink(rfid.cardNumber)}
      >
        Link Card
      </Button>
    </Stack>
  </Paper>
));

AvailableCardItem.displayName = "AvailableCardItem";

const RfidTab: React.FC<RfidTabProps> = ({
  tabIndex,
  panelIndex,
  user,
  rfidList,
  inSpaceUsers,
  onLinkRfid,
  onOpenUnlinkDialog,
  onReloadCurrentUsers,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<{
    severity: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Keep a ref to always have the latest onLinkRfid inside the NFC listener
  const onLinkRfidRef = useRef(onLinkRfid);
  useEffect(() => {
    onLinkRfidRef.current = onLinkRfid;
  }, [onLinkRfid]);

  const isNfcSupported = "NDEFReader" in window;

  const startScanning = async () => {
    try {
      // eslint-disable-next-line no-undef
      const ndef = new NDEFReader();
      await ndef.scan();
      setScanning(true);
      setScanStatus({
        severity: "info",
        message: "Hold an RFID card near the device to register it...",
      });

      // @ts-ignore
      ndef.addEventListener("reading", async ({ serialNumber }) => {
        if (serialNumber) {
          const cardNumber = serialNumber.replaceAll(":", "").toUpperCase();
          setScanning(false);
          setScanStatus({
            severity: "info",
            message: `Card ${cardNumber} detected. Linking...`,
          });

          try {
            // Use ref to avoid stale closure
            await onLinkRfidRef.current(cardNumber);
            setScanStatus({
              severity: "success",
              message: `Card ${cardNumber} successfully linked!`,
            });
          } catch {
            setScanStatus({
              severity: "error",
              message: "Failed to link card. Please try again.",
            });
          }
        }
      });
    } catch (error) {
      setScanning(false);
      setScanStatus({
        severity: "error",
        message: `Failed to start NFC scan: ${error}`,
      });
    }
  };

  return (
    <TabPanel value={tabIndex} index={panelIndex}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            RFID Card
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {user.rfid ? (
            <LinkedCard
              cardNumber={user.rfid.card_number}
              onUnlink={onOpenUnlinkDialog}
            />
          ) : (
            <Box>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
                No RFID card linked to this account
              </Alert>

              {/* NFC Scan Button */}
              { isNfcSupported && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={startScanning}
                    disabled={scanning}
                    startIcon={<NfcIcon />}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      letterSpacing: 1,
                      backgroundColor: scanning
                        ? "grey.500"
                        : "success.main",
                      "&:hover": {
                        backgroundColor: "success.dark",
                      },
                      animation: scanning
                        ? "pulse 1.5s ease-in-out infinite"
                        : "none",
                      "@keyframes pulse": {
                        "0%": { opacity: 1 },
                        "50%": { opacity: 0.6 },
                        "100%": { opacity: 1 },
                      },
                    }}
                  >
                    {scanning
                      ? "Waiting for card..."
                      : "Scan Card to Register"}
                  </Button>

                  {scanStatus && (
                    <Alert
                      severity={scanStatus.severity}
                      onClose={() => setScanStatus(null)}
                      sx={{ mt: 2 }}
                    >
                      {scanStatus.message}
                    </Alert>
                  )}
                </Box>
              )}
              <>
                <Box sx={{ mb: 3 }}>
                  <ChangeSpace
                    inSpaceUsers={inSpaceUsers}
                    handleReloadCurrentUsers={onReloadCurrentUsers}
                  />
                </Box>

                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Available RFID Cards
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  paragraph
                >
                  Tap a card in the selected space, then link it below
                </Typography>

                {rfidList.length === 0 ? (
                  <Alert severity="warning">
                    No unlinked cards detected. Please tap a card or select a
                    different space.
                  </Alert>
                ) : (
                  <Stack spacing={1}>
                    {rfidList.map((rfid, index) => (
                      <AvailableCardItem
                        key={index}
                        rfid={rfid}
                        onLink={onLinkRfid}
                      />
                    ))}
                  </Stack>
                )}
              </>
            </Box>
          )}
        </CardContent>
      </Card>
    </TabPanel>
  );
};

RfidTab.displayName = "RfidTab";

export default RfidTab;