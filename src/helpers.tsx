import React from "react";
import { Skeleton } from "@mui/material";

export const replaceNoneWithNotAvailable = (inputString: string | undefined | null): string => {
  if (inputString === undefined || inputString == null || inputString === "" || inputString === "None") {
    return "Not Available";
  }
  return inputString;
};

// eslint-disable-next-line default-param-last,@typescript-eslint/explicit-module-boundary-types
export const valueOrSkeleton = (
  items: any,
  value: string,
  // eslint-disable-next-line default-param-last
  variant = "text",
  width?: number | string,
  height?: number | string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  applyFunc?: Function | undefined
) => {
  let itemsList = items;
  try {
    value.split(".").forEach((item) => {
      itemsList = itemsList[item];
    });
  } catch {
    // @ts-ignore
    return <Skeleton variant={variant} width={width} height={height} />;
  }

  if (itemsList) {
    if (applyFunc) {
      return applyFunc(itemsList);
    }
    return itemsList;
  }
  // @ts-ignore
  return <Skeleton variant={variant} width={width} height={height} />;
};