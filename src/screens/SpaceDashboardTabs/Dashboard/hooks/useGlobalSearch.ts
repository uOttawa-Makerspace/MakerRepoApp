import { useState, useEffect, useMemo } from "react";
import { debounce } from "@mui/material/utils";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type { User } from "../types";

export const useGlobalSearch = (
  searchQuery: string,
  signedInUsernames: Set<string>
) => {
  const [allResults, setAllResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          const response = await HTTPRequest.get(
            `staff_dashboard/search?query=${encodeURIComponent(query)}`
          );
          setAllResults(response);
        } catch (error) {
          console.error("Global search failed:", error);
          setAllResults([]);
        } finally {
          setLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) {
      setAllResults([]);
      setLoading(false);
      debouncedSearch.clear();
      return;
    }

    setLoading(true);
    debouncedSearch(trimmed);

    return () => {
      debouncedSearch.clear();
    };
  }, [searchQuery, debouncedSearch]);

  // Filter out anyone already signed in
  const globalResults = useMemo(
    () => allResults.filter((user) => !signedInUsernames.has(user.username)),
    [allResults, signedInUsernames]
  );

  return { globalResults, globalSearchLoading: loading };
};