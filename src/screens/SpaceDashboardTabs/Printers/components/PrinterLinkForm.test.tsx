import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Autocomplete } from "@mui/material";
import { renderPrinterInput, renderUserInput } from "./PrinterLinkForm";

describe("PrinterLinkForm inputs", () => {
  it.each([
    ["printer", renderPrinterInput],
    ["user", renderUserInput],
  ])("renders the %s input with a start adornment", (_n, renderInput) => {
    const html = renderToString(
      <Autocomplete options={["a"]} value="a" renderInput={renderInput} />
    );
    expect(html).toContain("<svg");
  });
});
