import React, { memo } from "react";
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
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";
import ChangeSpace from "../../../components/ChangeSpace";
import { User, RfidInfo } from "../types";

interface RfidTabProps {
  tabIndex: number;
  panelIndex: number;
  user: User;
  isAdmin: boolean;
  rfidList: RfidInfo[];
  inSpaceUsers: any;
  onLinkRfid: (cardNumber: string) => void;
  onOpenUnlinkDialog: (cardNumber: string) => void;
  onReloadCurrentUsers: () => void;
}

const LinkedCard: React.FC<{
  cardNumber: string;
  isAdmin: boolean;
  onUnlink: (cardNumber: string) => void;
}> = memo(({ cardNumber, isAdmin, onUnlink }) => (
  <Alert
    severity="success"
    icon={<CheckCircleIcon />}
    action={
      isAdmin && (
        <Button
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onUnlink(cardNumber)}
        >
          Remove
        </Button>
      )
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

const RfidTab: React.FC<RfidTabProps> = memo(
  ({
    tabIndex,
    panelIndex,
    user,
    isAdmin,
    rfidList,
    inSpaceUsers,
    onLinkRfid,
    onOpenUnlinkDialog,
    onReloadCurrentUsers,
  }) => (
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
              isAdmin={isAdmin}
              onUnlink={onOpenUnlinkDialog}
            />
          ) : (
            <Box>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
                No RFID card linked to this account
              </Alert>

              {isAdmin && (
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
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </TabPanel>
  )
);

RfidTab.displayName = "RfidTab";

export default RfidTab;