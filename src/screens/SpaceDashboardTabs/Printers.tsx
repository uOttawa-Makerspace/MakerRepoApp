import React, { useEffect, useState, useRef } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import toast, { Toaster } from "react-hot-toast";
import { Tab, Tabs } from "@mui/material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../../components/TabPanel";
import PrinterIssues from "./PrinterIssues"

type PrinterType = {
  id: number;
  name: string;
  short_form: string;
  available: boolean;
  printers: Printer[];
};

type Printer = {
  id: number;
  number: string;
  maintenance: boolean;
  has_issues: boolean;
};

type PrintersProps = {
  inSpaceUsers: any;
  handleReloadCurrentUsers: () => void;
  reloadPrinters: () => void;
};

type PrinterLinkFormProps = {
  pt: PrinterType;
  inSpaceUsers: any;
  reloadPrinters: () => void;
};

interface userSearch {
  name: string;
  id: string;
}

const PrinterLinkForm: React.FC<PrinterLinkFormProps> = ({
  pt,
  inSpaceUsers,
  reloadPrinters,
}) => {
  const [printerTypeAheadValue, setPrinterTypeAheadValue] = useState<userSearch[]>([]);
  // @ts-ignore
  const printerSelect = useRef<Typeahead>(null);
  // @ts-ignore
  const userSelect = useRef<Typeahead>(null);
  const [userTypeAheadValue, setUserTypeAheadValue] = useState<userSearch[]>([]);

  const printers = pt.printers
                     .map((printer: Printer) => ({
                       name: pt.short_form + " - " + printer.number,
                       id: printer.id,
                     }))
                     .sort((a, b) => (a.name >= b.name && a.name.length >= b.name.length ? 1 : 0));
  const users = inSpaceUsers.space_users.map((u: userSearch) => ({
    name: u.name,
    id: u.id,
  }));

  function linkUserToPrinter(e: React.FormEvent) {
    e.preventDefault();
    if (userTypeAheadValue.length == 0 || printerTypeAheadValue.length == 0) return;
    const userid = userTypeAheadValue[0].id;
    const printerid = printerTypeAheadValue[0].id;
    setPrinterTypeAheadValue([]);
    setUserTypeAheadValue([]);

    console.log(printerid + " - " + userid);

    HTTPRequest.patch("printers/link_printer_to_user", {
      printer: {
        user_id: userid,
        printer_id: printerid,
      },
    })
               .then(() => {
                 toast.success(`Linked to ${printerTypeAheadValue[0].name}`);
               })
               .catch((error) => {
                 console.error(error);
               });
    // UI only I think?
    // printerSelect.current.clear();
    // userSelect.current?.clear();
  }

  return (
    <form onSubmit={linkUserToPrinter}>
      <h3 className="text-center mb-3">{pt.name}</h3>
      <div className="row mb-3 g-2">
        <Typeahead
          ref={printerSelect}
          id={`printer-select-${pt.id}`}
          className="col-lg-5"
          labelKey="name"
          // @ts-ignore
          onChange={(e) => setPrinterTypeAheadValue(e)}
          selected={printerTypeAheadValue}
          options={printers}
          placeholder="Select printer..."
        />
        <Typeahead
          ref={userSelect}
          id={`user-select-${pt.id}`}
          className="col-lg-5"
          labelKey="name"
          // @ts-ignore
          onChange={setUserTypeAheadValue}
          selected={userTypeAheadValue}
          options={users}
          placeholder="Search for a user..."
        />
        <input type="submit" className="btn btn-primary col-lg-2" value="Submit" />
      </div>
    </form>
  );
};

const Printers: React.FC<PrintersProps> = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
  reloadPrinters,
}) => {
  const [printers, setPrinters] = useState<PrinterType[]>([]);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const data = await HTTPRequest.get("printers/printer_data");
        const formattedPrinters = data.map((pt: PrinterType) => ({
          id: pt.id,
          name: pt.name,
          short_form: pt.short_form,
          available: pt.available,
          printers: pt.printers.map((p: Printer) => ({
            id: p.id,
            number: p.number,
            maintenance: p.maintenance,
            has_issues: p.has_issues,
          })),
        }));
        setPrinters(formattedPrinters);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load printers");
      }
    };

    fetchPrinters();
  }, [reloadPrinters]);

  const linkForms = printers.map((pt) => (
    <PrinterLinkForm
      key={pt.id}
      pt={pt}
      inSpaceUsers={inSpaceUsers}
      reloadPrinters={reloadPrinters}
    />
  ));

  return (
    <>
      <Tabs className="w-100"
            value={tabIndex}
            onChange={handleTabChange}
      >
        <Tab label="Link" className="w-50" {...a11yProps(0)} />
        <Tab label="Issue" className="w-50" {...a11yProps(1)} />
      </Tabs>
    <TabPanel value={tabIndex} index={0}>
      <h3 className="text-center mt-2">Printers</h3>
      <div className="container">{linkForms}</div>
    </TabPanel>
    <Toaster />
    <TabPanel value={tabIndex} index={1} >
      <h3 className="text-center mt-2">Issues</h3>
      <PrinterIssues />
    </TabPanel>
    </>
  );
};

export default Printers;
