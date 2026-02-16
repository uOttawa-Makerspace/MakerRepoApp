import React from "react";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { FAQ, ContactFormField } from "./types";

export const FAQS: FAQ[] = [
  {
    question: "How do I sign in to a space?",
    answer:
      "You can sign in using your RFID card at the entrance or through the staff dashboard.",
  },
  {
    question: "How do I get training on equipment?",
    answer:
      "Contact a staff member in the space or check the training sessions schedule in the app.",
  },
  {
    question: "What if a printer has an issue?",
    answer:
      "Report the issue through the Printers tab in the staff dashboard, or contact staff directly.",
  },
  {
    question: "How do I get certified?",
    answer:
      "Complete a training session and the instructor will certify you upon successful completion.",
  },
  {
    question: "Can I book equipment in advance?",
    answer:
      "Equipment booking policies vary by space. Please contact your local makerspace staff.",
  },
];

export const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  subject: "",
  comments: "",
} as const;

export const SUPPORT_EMAIL = "uottawa.makerepo@gmail.com";

export const FORM_FIELDS: ContactFormField[] = [
  {
    key: "name",
    label: "Full Name",
    icon: React.createElement(PersonIcon, {
      sx: { mr: 1, color: "action.active" },
    }),
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    icon: React.createElement(EmailIcon, {
      sx: { mr: 1, color: "action.active" },
    }),
    helperText: "We'll reply to this email",
  },
  {
    key: "subject",
    label: "Subject",
    icon: React.createElement(SubjectIcon, {
      sx: { mr: 1, color: "action.active" },
    }),
  },
  {
    key: "comments",
    label: "Message",
    multiline: true,
    rows: 6,
    maxLength: 1000,
    icon: React.createElement(MessageIcon, {
      sx: { mr: 1, color: "action.active", alignSelf: "flex-start", mt: 1.5 },
    }),
  },
];